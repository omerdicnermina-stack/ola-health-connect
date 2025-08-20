-- Fix RLS security issue on Accounts table
-- Enable RLS and add basic policies since the table appears to be unused

ALTER TABLE public."Accounts" ENABLE ROW LEVEL SECURITY;

-- Add restrictive policies for the Accounts table
CREATE POLICY "Authenticated users can view accounts" ON public."Accounts"
  FOR SELECT TO authenticated USING (false); -- No one can see accounts for now

CREATE POLICY "No inserts allowed on accounts" ON public."Accounts"  
  FOR INSERT TO authenticated WITH CHECK (false); -- No inserts allowed

CREATE POLICY "No updates allowed on accounts" ON public."Accounts"
  FOR UPDATE TO authenticated USING (false); -- No updates allowed

CREATE POLICY "No deletes allowed on accounts" ON public."Accounts"
  FOR DELETE TO authenticated USING (false); -- No deletes allowed