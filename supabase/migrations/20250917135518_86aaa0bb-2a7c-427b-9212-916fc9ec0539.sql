-- Insert additional mock visit data for demonstration
-- Using common test UUIDs that might be used in development

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
-- Mock data for potential test users
(
  '11111111-1111-1111-1111-111111111111', 
  '22222222-2222-2222-2222-222222222222',
  'Urgent Care Visit', 
  '2024-12-10 09:15:00+00', 
  'completed', 
  'Persistent cough and chest congestion',
  'Upper respiratory infection',
  'Prescribed azithromycin 250mg, increase fluid intake, rest',
  'Patient presented with 5-day history of productive cough. Lungs clear to auscultation. Prescribed antibiotics and advised to return if symptoms worsen.',
  true,
  '2024-12-24 09:00:00+00',
  'Follow-up to ensure symptoms have resolved and no complications',
  'video'
),
(
  '33333333-3333-3333-3333-333333333333', 
  '44444444-4444-4444-4444-444444444444',
  'Dermatology Consultation', 
  '2024-12-08 14:30:00+00', 
  'completed', 
  'Skin rash on arms and legs',
  'Contact dermatitis, likely allergic reaction',
  'Topical corticosteroid cream, avoid known allergens, antihistamine as needed',
  'Patient developed rash after trying new laundry detergent. Recommend patch testing to identify specific allergens. Rash should resolve in 7-10 days with treatment.',
  true,
  '2024-12-22 14:30:00+00',
  'Check healing progress and discuss allergy test results',
  'in-person'
),
(
  '55555555-5555-5555-5555-555555555555', 
  '66666666-6666-6666-6666-666666666666',
  'Wellness Check-up', 
  '2024-12-05 11:00:00+00', 
  'completed', 
  'Annual physical examination',
  'Generally healthy, mild vitamin D deficiency',
  'Continue current exercise routine, vitamin D3 supplement 2000 IU daily, Mediterranean diet',
  'Excellent overall health. Lab results show all values within normal limits except vitamin D at 25 ng/mL. Patient is active and maintaining healthy weight.',
  true,
  '2025-06-05 11:00:00+00',
  'Annual follow-up, recheck vitamin D levels, routine screening',
  'in-person'
),
(
  '77777777-7777-7777-7777-777777777777', 
  '88888888-8888-8888-8888-888888888888',
  'Mental Health Follow-up', 
  '2024-11-28 16:00:00+00', 
  'completed', 
  'Anxiety management and medication review',
  'Generalized anxiety disorder - stable on current treatment',
  'Continue sertraline 50mg daily, practice mindfulness techniques, weekly therapy sessions',
  'Patient reports significant improvement in anxiety symptoms. Sleep quality has improved. Discussed coping strategies for work stress. Very engaged in treatment.',
  true,
  '2025-01-28 16:00:00+00',
  'Review medication effectiveness, assess need for dosage adjustment',
  'video'
),
-- Add data that might match the current authenticated user
(
  auth.uid(), 
  '99999999-9999-9999-9999-999999999999',
  'Preventive Care Visit', 
  '2024-12-12 10:45:00+00', 
  'completed', 
  'Routine health maintenance and preventive screening',
  'Excellent health status, up to date on all screenings',
  'Continue current healthy lifestyle, schedule mammogram/colonoscopy per guidelines, flu vaccination',
  'Patient is proactive about health maintenance. All vital signs normal. Discussed importance of regular exercise and balanced nutrition. Very health-conscious individual.',
  true,
  '2025-01-15 10:45:00+00',
  'Overdue - Schedule routine blood work and discuss any health concerns',
  'video'
) WHERE auth.uid() IS NOT NULL;

-- Also add a fallback entry for when no user is authenticated (for demo purposes)
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
(
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'Telehealth Consultation', 
  '2024-12-14 13:20:00+00', 
  'completed', 
  'Joint pain and stiffness in hands',
  'Early osteoarthritis, likely age-related wear',
  'Anti-inflammatory medication as needed, hand exercises, ergonomic workspace setup',
  'Patient works long hours at computer. Joint stiffness worse in mornings. Recommended regular breaks and stretching exercises. Consider physical therapy if symptoms persist.',
  true,
  '2024-12-28 13:20:00+00',
  'Overdue - Assess pain levels and discuss physical therapy options',
  'video'
);