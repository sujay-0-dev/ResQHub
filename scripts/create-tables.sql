-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret-here';

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  location TEXT,
  organization TEXT,
  role TEXT CHECK (role IN ('victim', 'volunteer', 'ngo', 'government')) NOT NULL,
  verification_status TEXT CHECK (verification_status IN ('pending', 'verified', 'rejected')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  emergency_contact TEXT,
  skills TEXT[],
  certifications TEXT[],
  availability_status TEXT CHECK (availability_status IN ('available', 'busy', 'offline')) DEFAULT 'available'
);

-- Create emergency_alerts table
CREATE TABLE IF NOT EXISTS emergency_alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  alert_type TEXT CHECK (alert_type IN ('earthquake', 'flood', 'wildfire', 'hurricane', 'tornado', 'heatwave')) NOT NULL,
  severity TEXT CHECK (severity IN ('low', 'moderate', 'high', 'extreme')) NOT NULL,
  location TEXT NOT NULL,
  coordinates JSONB NOT NULL,
  radius_km INTEGER DEFAULT 5,
  status TEXT CHECK (status IN ('active', 'monitoring', 'resolved')) DEFAULT 'active',
  created_by UUID REFERENCES user_profiles(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  affected_population INTEGER,
  instructions TEXT[]
);

-- Create resource_requests table
CREATE TABLE IF NOT EXISTS resource_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  requester_id UUID REFERENCES user_profiles(id) NOT NULL,
  resource_type TEXT CHECK (resource_type IN ('food', 'water', 'shelter', 'medical', 'transport', 'clothing', 'other')) NOT NULL,
  description TEXT NOT NULL,
  quantity_needed INTEGER DEFAULT 1,
  urgency TEXT CHECK (urgency IN ('low', 'medium', 'high', 'critical')) NOT NULL,
  location TEXT NOT NULL,
  coordinates JSONB NOT NULL,
  status TEXT CHECK (status IN ('open', 'in_progress', 'fulfilled', 'cancelled')) DEFAULT 'open',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  fulfilled_by UUID REFERENCES user_profiles(id),
  notes TEXT
);

-- Create volunteer_assignments table
CREATE TABLE IF NOT EXISTS volunteer_assignments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  volunteer_id UUID REFERENCES user_profiles(id) NOT NULL,
  alert_id UUID REFERENCES emergency_alerts(id),
  resource_request_id UUID REFERENCES resource_requests(id),
  assignment_type TEXT CHECK (assignment_type IN ('alert_response', 'resource_delivery', 'coordination')) NOT NULL,
  status TEXT CHECK (status IN ('assigned', 'in_progress', 'completed', 'cancelled')) DEFAULT 'assigned',
  assigned_by UUID REFERENCES user_profiles(id) NOT NULL,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT
);

-- Create audit_logs table for compliance
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id),
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Government and NGO users can view all profiles" ON user_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role IN ('government', 'ngo')
      AND verification_status = 'verified'
    )
  );

-- RLS Policies for emergency_alerts
CREATE POLICY "Everyone can view active alerts" ON emergency_alerts
  FOR SELECT USING (status IN ('active', 'monitoring'));

CREATE POLICY "Government and verified NGO users can create alerts" ON emergency_alerts
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role IN ('government', 'ngo')
      AND verification_status = 'verified'
    )
  );

CREATE POLICY "Alert creators and government users can update alerts" ON emergency_alerts
  FOR UPDATE USING (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role = 'government'
      AND verification_status = 'verified'
    )
  );

-- RLS Policies for resource_requests
CREATE POLICY "Users can view resource requests in their area" ON resource_requests
  FOR SELECT USING (true); -- Location-based filtering handled in application

CREATE POLICY "Authenticated users can create resource requests" ON resource_requests
  FOR INSERT WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Requesters and volunteers can update resource requests" ON resource_requests
  FOR UPDATE USING (
    requester_id = auth.uid() OR
    fulfilled_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role IN ('volunteer', 'ngo', 'government')
      AND verification_status = 'verified'
    )
  );

-- Create indexes for performance
CREATE INDEX idx_user_profiles_role ON user_profiles(role);
CREATE INDEX idx_user_profiles_verification ON user_profiles(verification_status);
CREATE INDEX idx_emergency_alerts_status ON emergency_alerts(status);
CREATE INDEX idx_emergency_alerts_location ON emergency_alerts USING GIN(coordinates);
CREATE INDEX idx_resource_requests_status ON resource_requests(status);
CREATE INDEX idx_resource_requests_location ON resource_requests USING GIN(coordinates);
CREATE INDEX idx_resource_requests_urgency ON resource_requests(urgency);

-- Create functions for automatic timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for automatic timestamps
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_emergency_alerts_updated_at BEFORE UPDATE ON emergency_alerts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resource_requests_updated_at BEFORE UPDATE ON resource_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to automatically create user profile after signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'victim')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
