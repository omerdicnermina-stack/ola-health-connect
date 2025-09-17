import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  CheckCircle, 
  ArrowLeft, 
  ArrowRight,
  Heart,
  Stethoscope,
  Phone,
  Video,
  MapPin
} from 'lucide-react';

interface TriageQuestion {
  id: string;
  question: string;
  options: {
    text: string;
    value: string;
    weight: { [key: string]: number };
  }[];
}

interface ServiceRecommendation {
  id: string;
  name: string;
  description: string;
  urgency: 'low' | 'medium' | 'high' | 'emergency';
  modality: 'video' | 'phone' | 'in-person';
  icon: React.ComponentType<any>;
}

const triageQuestions: TriageQuestion[] = [
  {
    id: '1',
    question: 'Are you experiencing any pain right now?',
    options: [
      { text: 'Yes, severe pain that is hard to bear', value: 'severe_pain', weight: { 'urgent': 5, 'emergency': 3 } },
      { text: 'Yes, moderate pain that bothers me', value: 'moderate_pain', weight: { 'general': 4, 'urgent': 2 } },
      { text: 'Yes, mild pain or discomfort', value: 'mild_pain', weight: { 'general': 3, 'preventive': 1 } },
      { text: 'No, I am not experiencing pain', value: 'no_pain', weight: { 'preventive': 2, 'mental': 3 } }
    ]
  },
  {
    id: '2',
    question: 'Where is your pain located? (if applicable)',
    options: [
      { text: 'Chest or heart area', value: 'chest_pain', weight: { 'urgent': 5, 'emergency': 4 } },
      { text: 'Head or neck', value: 'head_pain', weight: { 'general': 3, 'urgent': 2 } },
      { text: 'Stomach or abdomen', value: 'stomach_pain', weight: { 'general': 3, 'urgent': 2 } },
      { text: 'Back, joints, or muscles', value: 'musculoskeletal', weight: { 'general': 3, 'specialty': 2 } },
      { text: 'No specific pain location', value: 'no_location', weight: { 'general': 1 } }
    ]
  },
  {
    id: '3',
    question: 'Have you had a fever in the last 24-48 hours?',
    options: [
      { text: 'Yes, high fever (over 103°F/39.4°C)', value: 'high_fever', weight: { 'urgent': 5, 'emergency': 3 } },
      { text: 'Yes, moderate fever (100-103°F/37.8-39.4°C)', value: 'moderate_fever', weight: { 'general': 4, 'urgent': 2 } },
      { text: 'Yes, low-grade fever (99-100°F/37.2-37.8°C)', value: 'low_fever', weight: { 'general': 3 } },
      { text: 'No fever', value: 'no_fever', weight: { 'general': 1, 'preventive': 2 } }
    ]
  },
  {
    id: '4',
    question: 'How well have you been sleeping lately?',
    options: [
      { text: 'Very poorly - barely sleeping at all', value: 'very_poor_sleep', weight: { 'mental': 4, 'general': 2 } },
      { text: 'Poorly - frequent interruptions or trouble falling asleep', value: 'poor_sleep', weight: { 'mental': 3, 'general': 2 } },
      { text: 'Somewhat well - occasional sleep issues', value: 'okay_sleep', weight: { 'general': 2, 'preventive': 1 } },
      { text: 'Very well - sleeping normally', value: 'good_sleep', weight: { 'preventive': 3, 'general': 1 } }
    ]
  },
  {
    id: '5',
    question: 'Are you experiencing any of these symptoms?',
    options: [
      { text: 'Difficulty breathing or shortness of breath', value: 'breathing', weight: { 'urgent': 5, 'emergency': 4 } },
      { text: 'Nausea, vomiting, or diarrhea', value: 'digestive', weight: { 'general': 4, 'urgent': 2 } },
      { text: 'Dizziness, weakness, or fatigue', value: 'weakness', weight: { 'general': 3, 'urgent': 1 } },
      { text: 'Anxiety, stress, or mood changes', value: 'mental_symptoms', weight: { 'mental': 5, 'general': 1 } },
      { text: 'None of the above', value: 'no_symptoms', weight: { 'preventive': 3, 'general': 1 } }
    ]
  },
  {
    id: '6',
    question: 'What brings you to seek care today?',
    options: [
      { text: 'New symptoms that just started', value: 'new_symptoms', weight: { 'general': 4, 'urgent': 2 } },
      { text: 'Ongoing symptoms getting worse', value: 'worsening', weight: { 'urgent': 4, 'general': 2 } },
      { text: 'Follow-up on existing condition', value: 'followup', weight: { 'specialty': 3, 'general': 2 } },
      { text: 'Routine wellness or prevention', value: 'wellness', weight: { 'preventive': 5, 'general': 1 } }
    ]
  }
];

const serviceRecommendations: ServiceRecommendation[] = [
  {
    id: 'urgent',
    name: 'Urgent Care',
    description: 'For immediate medical concerns that need prompt attention',
    urgency: 'high',
    modality: 'video',
    icon: Heart
  },
  {
    id: 'general',
    name: 'General Consultation',
    description: 'For routine medical questions and general health concerns',
    urgency: 'medium',
    modality: 'video',
    icon: Stethoscope
  },
  {
    id: 'mental',
    name: 'Mental Health Support',
    description: 'For mental wellness, stress, anxiety, and emotional support',
    urgency: 'medium',
    modality: 'video',
    icon: Brain
  },
  {
    id: 'preventive',
    name: 'Preventive Care',
    description: 'For wellness check-ups, screenings, and preventive services',
    urgency: 'low',
    modality: 'video',
    icon: CheckCircle
  },
  {
    id: 'specialty',
    name: 'Specialist Referral',
    description: 'For specialized medical conditions requiring expert care',
    urgency: 'medium',
    modality: 'in-person',
    icon: Stethoscope
  },
  {
    id: 'emergency',
    name: 'Emergency Care',
    description: 'Please call 911 or go to your nearest emergency room immediately',
    urgency: 'emergency',
    modality: 'in-person',
    icon: Heart
  }
];

interface AITriageAssistantProps {
  trigger: React.ReactNode;
}

export default function AITriageAssistant({ trigger }: AITriageAssistantProps) {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const goToNext = () => {
    if (currentStep < triageQuestions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const goToPrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const resetTriage = () => {
    setCurrentStep(0);
    setAnswers({});
    setShowResults(false);
  };

  const calculateRecommendation = (): ServiceRecommendation => {
    const scores: { [key: string]: number } = {};
    
    // Calculate scores based on answers
    triageQuestions.forEach(question => {
      const answer = answers[question.id];
      if (answer) {
        const option = question.options.find(opt => opt.value === answer);
        if (option) {
          Object.entries(option.weight).forEach(([service, weight]) => {
            scores[service] = (scores[service] || 0) + weight;
          });
        }
      }
    });

    // Find the service with the highest score
    const topService = Object.entries(scores).reduce((a, b) => 
      scores[a[0]] > scores[b[0]] ? a : b
    )[0];

    return serviceRecommendations.find(service => service.id === topService) || serviceRecommendations[1];
  };

  const getModalityIcon = (modality: string) => {
    switch (modality) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'phone': return <Phone className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'emergency': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const progress = ((currentStep + 1) / triageQuestions.length) * 100;
  const currentQuestion = triageQuestions[currentStep];
  const currentAnswer = answers[currentQuestion?.id];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI Triage Assistant
          </DialogTitle>
        </DialogHeader>

        {!showResults ? (
          <div className="space-y-6">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Question {currentStep + 1} of {triageQuestions.length}</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Question Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{currentQuestion.question}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {currentQuestion.options.map((option) => (
                  <Button
                    key={option.value}
                    variant={currentAnswer === option.value ? "default" : "outline"}
                    className="w-full justify-start text-left h-auto p-4"
                    onClick={() => handleAnswer(currentQuestion.id, option.value)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        currentAnswer === option.value 
                          ? 'border-primary bg-primary' 
                          : 'border-muted-foreground'
                      }`}>
                        {currentAnswer === option.value && (
                          <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                        )}
                      </div>
                      <span>{option.text}</span>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={goToPrevious}
                disabled={currentStep === 0}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              <Button
                onClick={goToNext}
                disabled={!currentAnswer}
              >
                {currentStep === triageQuestions.length - 1 ? 'Get Recommendation' : 'Next'}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Results */}
            <div className="text-center space-y-2">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
              <h3 className="text-lg font-semibold">Recommendation Complete</h3>
              <p className="text-muted-foreground">Based on your responses, here's our suggestion:</p>
            </div>

            {/* Recommended Service */}
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    {React.createElement(calculateRecommendation().icon, { className: "h-5 w-5" })}
                    {calculateRecommendation().name}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Badge className={getUrgencyColor(calculateRecommendation().urgency)}>
                      {calculateRecommendation().urgency.charAt(0).toUpperCase() + calculateRecommendation().urgency.slice(1)} Priority
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      {getModalityIcon(calculateRecommendation().modality)}
                      <span className="capitalize">{calculateRecommendation().modality}</span>
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{calculateRecommendation().description}</p>
                
                {calculateRecommendation().urgency === 'emergency' ? (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-red-800 font-semibold mb-2">
                      <Heart className="h-5 w-5" />
                      Medical Emergency
                    </div>
                    <p className="text-red-700 text-sm">
                      If you are experiencing a medical emergency, <strong>call 911 immediately</strong> or go to your nearest emergency room.
                    </p>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <Button className="flex-1" onClick={() => setOpen(false)}>
                      Schedule {calculateRecommendation().name}
                    </Button>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                      Start Instant Visit
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-between">
              <Button variant="outline" onClick={resetTriage}>
                Start Over
              </Button>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}