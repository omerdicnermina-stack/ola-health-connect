-- Insert additional mock visit data for demonstration
-- Just adding visits without provider references to avoid foreign key issues

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
  '11111111-1111-1111-1111-111111111111', 
  NULL,
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
  NULL,
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
  'demo-user-id-for-testing-12345', 
  NULL,
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