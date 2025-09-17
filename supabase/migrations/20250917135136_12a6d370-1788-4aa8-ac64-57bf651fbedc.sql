-- Create visits table to track patient visits
CREATE TABLE public.visits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL,
  provider_id UUID,
  visit_type TEXT NOT NULL,
  visit_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled',
  chief_complaint TEXT,
  diagnosis TEXT,
  treatment_plan TEXT,
  notes TEXT,
  follow_up_needed BOOLEAN DEFAULT false,
  follow_up_date TIMESTAMP WITH TIME ZONE,
  follow_up_notes TEXT,
  visit_modality TEXT DEFAULT 'video',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;

-- Create policies for visits
CREATE POLICY "Patients can view their own visits" 
ON public.visits 
FOR SELECT 
USING (auth.uid() = patient_id);

CREATE POLICY "Providers can view their patient visits" 
ON public.visits 
FOR SELECT 
USING (
  auth.uid() = provider_id OR 
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('Admin', 'Super Admin', 'Provider', 'Provider-Admin')
  )
);

CREATE POLICY "Providers can create visits" 
ON public.visits 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('Admin', 'Super Admin', 'Provider', 'Provider-Admin')
  )
);

CREATE POLICY "Providers can update visits" 
ON public.visits 
FOR UPDATE 
USING (
  auth.uid() = provider_id OR 
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('Admin', 'Super Admin', 'Provider', 'Provider-Admin')
  )
);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_visits_updated_at
BEFORE UPDATE ON public.visits
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample visit data for demonstration
INSERT INTO public.visits (
  patient_id, 
  provider_id, 
  visit_type, 
  visit_date, 
  status, 
  chief_complaint, 
  diagnosis, 
  treatment_plan, 
  notes,
  follow_up_needed,
  follow_up_date,
  follow_up_notes,
  visit_modality
) VALUES 
-- Note: These are sample UUIDs, in real usage these would reference actual user IDs
(
  '00000000-0000-0000-0000-000000000001', 
  '00000000-0000-0000-0000-000000000002',
  'Routine Checkup', 
  '2024-12-15 14:00:00+00', 
  'completed', 
  'Annual wellness exam',
  'Overall good health, mild hypertension',
  'Continue current medication, lifestyle modifications',
  'Patient reports feeling well. BP slightly elevated at 140/90. Discussed diet and exercise.',
  true,
  '2025-03-15 14:00:00+00',
  'Follow-up to check blood pressure and discuss lab results',
  'in-person'
),
(
  '00000000-0000-0000-0000-000000000001', 
  '00000000-0000-0000-0000-000000000003',
  'Mental Health Consultation', 
  '2024-11-20 10:30:00+00', 
  'completed', 
  'Stress and anxiety management',
  'Generalized anxiety disorder, mild depression',
  'Cognitive behavioral therapy, meditation techniques',
  'Patient discussed work-related stress. Provided coping strategies and relaxation techniques.',
  true,
  '2025-01-20 10:30:00+00',
  'Check progress on anxiety management and therapy effectiveness',
  'video'
);