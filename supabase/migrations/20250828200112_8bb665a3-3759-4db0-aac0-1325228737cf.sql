-- Create questionnaires table
CREATE TABLE public.questionnaires (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL, -- 'pre-visit', 'intake', 'assessment', 'post-visit', etc.
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  organization TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create questions table
CREATE TABLE public.questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  questionnaire_id UUID NOT NULL REFERENCES public.questionnaires(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL, -- 'text', 'textarea', 'radio', 'checkbox', 'select', 'date', 'number', 'boolean'
  options JSONB, -- For radio, checkbox, select options
  is_required BOOLEAN NOT NULL DEFAULT false,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create conditional logic table for skip logic
CREATE TABLE public.question_conditions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  condition_question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  condition_operator TEXT NOT NULL, -- 'equals', 'not_equals', 'contains', 'greater_than', 'less_than'
  condition_value TEXT NOT NULL,
  action TEXT NOT NULL DEFAULT 'show', -- 'show', 'hide', 'require'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create questionnaire responses table
CREATE TABLE public.questionnaire_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  questionnaire_id UUID NOT NULL REFERENCES public.questionnaires(id),
  visit_id UUID, -- Will be linked to visits when that system is implemented
  patient_id UUID NOT NULL REFERENCES auth.users(id),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create question answers table
CREATE TABLE public.question_answers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  response_id UUID NOT NULL REFERENCES public.questionnaire_responses(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  answer_text TEXT,
  answer_number NUMERIC,
  answer_boolean BOOLEAN,
  answer_date DATE,
  answer_options JSONB, -- For multiple choice answers
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.questionnaires ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_conditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questionnaire_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_answers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for questionnaires
CREATE POLICY "Authorized users can view questionnaires" 
ON public.questionnaires 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('Admin', 'Super Admin', 'Provider', 'Provider-Admin', 'Manager')
  )
);

CREATE POLICY "Authorized users can create questionnaires" 
ON public.questionnaires 
FOR INSERT 
WITH CHECK (
  auth.uid() = created_by AND
  EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('Admin', 'Super Admin', 'Provider', 'Provider-Admin', 'Manager')
  )
);

CREATE POLICY "Creators can update their questionnaires" 
ON public.questionnaires 
FOR UPDATE 
USING (
  auth.uid() = created_by AND
  EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('Admin', 'Super Admin', 'Provider', 'Provider-Admin', 'Manager')
  )
);

CREATE POLICY "Authorized users can delete questionnaires" 
ON public.questionnaires 
FOR DELETE 
USING (
  (auth.uid() = created_by OR
   EXISTS (
     SELECT 1 FROM public.user_profiles 
     WHERE user_id = auth.uid() 
     AND role IN ('Admin', 'Super Admin')
   ))
);

-- RLS Policies for questions
CREATE POLICY "Users can view questions for accessible questionnaires" 
ON public.questions 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.questionnaires q 
    WHERE q.id = questionnaire_id 
    AND (
      EXISTS (
        SELECT 1 FROM public.user_profiles 
        WHERE user_id = auth.uid() 
        AND role IN ('Admin', 'Super Admin', 'Provider', 'Provider-Admin', 'Manager', 'Patient')
      )
    )
  )
);

CREATE POLICY "Authorized users can manage questions" 
ON public.questions 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.questionnaires q 
    JOIN public.user_profiles up ON up.user_id = auth.uid()
    WHERE q.id = questionnaire_id 
    AND (q.created_by = auth.uid() OR up.role IN ('Admin', 'Super Admin'))
  )
);

-- RLS Policies for conditions
CREATE POLICY "Users can view conditions for accessible questions" 
ON public.question_conditions 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.questions q 
    JOIN public.questionnaires qn ON qn.id = q.questionnaire_id
    WHERE q.id = question_id 
    AND (
      EXISTS (
        SELECT 1 FROM public.user_profiles 
        WHERE user_id = auth.uid() 
        AND role IN ('Admin', 'Super Admin', 'Provider', 'Provider-Admin', 'Manager', 'Patient')
      )
    )
  )
);

CREATE POLICY "Authorized users can manage conditions" 
ON public.question_conditions 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.questions q 
    JOIN public.questionnaires qn ON qn.id = q.questionnaire_id
    JOIN public.user_profiles up ON up.user_id = auth.uid()
    WHERE q.id = question_id 
    AND (qn.created_by = auth.uid() OR up.role IN ('Admin', 'Super Admin'))
  )
);

-- RLS Policies for responses (patients can create/view their own, providers can view)
CREATE POLICY "Users can view relevant responses" 
ON public.questionnaire_responses 
FOR SELECT 
USING (
  patient_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('Admin', 'Super Admin', 'Provider', 'Provider-Admin')
  )
);

CREATE POLICY "Patients can create their responses" 
ON public.questionnaire_responses 
FOR INSERT 
WITH CHECK (auth.uid() = patient_id);

-- RLS Policies for answers
CREATE POLICY "Users can view relevant answers" 
ON public.question_answers 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.questionnaire_responses qr 
    WHERE qr.id = response_id 
    AND (
      qr.patient_id = auth.uid() OR
      EXISTS (
        SELECT 1 FROM public.user_profiles 
        WHERE user_id = auth.uid() 
        AND role IN ('Admin', 'Super Admin', 'Provider', 'Provider-Admin')
      )
    )
  )
);

CREATE POLICY "Users can manage answers for their responses" 
ON public.question_answers 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.questionnaire_responses qr 
    WHERE qr.id = response_id 
    AND qr.patient_id = auth.uid()
  )
);

-- Create triggers for updated_at
CREATE TRIGGER update_questionnaires_updated_at
BEFORE UPDATE ON public.questionnaires
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_questionnaires_created_by ON public.questionnaires(created_by);
CREATE INDEX idx_questionnaires_category ON public.questionnaires(category);
CREATE INDEX idx_questions_questionnaire_id ON public.questions(questionnaire_id);
CREATE INDEX idx_questions_order ON public.questions(questionnaire_id, order_index);
CREATE INDEX idx_conditions_question_id ON public.question_conditions(question_id);
CREATE INDEX idx_responses_questionnaire_id ON public.questionnaire_responses(questionnaire_id);
CREATE INDEX idx_responses_patient_id ON public.questionnaire_responses(patient_id);
CREATE INDEX idx_answers_response_id ON public.question_answers(response_id);
CREATE INDEX idx_answers_question_id ON public.question_answers(question_id);