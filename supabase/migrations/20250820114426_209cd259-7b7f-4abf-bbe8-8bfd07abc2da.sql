-- Fix RLS policies for Accounts table
-- Since this appears to be an unused table, we'll add basic policies or consider if it should be dropped

-- Check if Accounts table is being used, if not we can disable RLS
ALTER TABLE public.Accounts DISABLE ROW LEVEL SECURITY;

-- Alternatively, if you want to keep RLS enabled, uncomment these policies:
-- CREATE POLICY "Enable read access for authenticated users" ON public.Accounts
--   FOR SELECT TO authenticated USING (true);

-- CREATE POLICY "Enable insert for authenticated users" ON public.Accounts  
--   FOR INSERT TO authenticated WITH CHECK (true);

-- Ensure the trigger for creating user profiles exists and is active
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, email, name, role)
  VALUES (
    NEW.id, 
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'New User'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'Manager')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';

-- Create the trigger if it doesn't exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();