import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Brain, 
  Heart, 
  Stethoscope, 
  Activity, 
  Pill, 
  Phone,
  Video,
  Shield,
  Star,
  Clock,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface AssessmentQuestion {
  id: string;
  question: string;
  options: string[];
  category: 'mental_health' | 'physical_health' | 'wellness' | 'urgent';
}

const assessmentQuestions: AssessmentQuestion[] = [
  {
    id: '1',
    question: 'How are you feeling today?',
    options: ['Great', 'Good', 'Okay', 'Not well', 'Terrible'],
    category: 'mental_health'
  },
  {
    id: '2',
    question: 'Are you experiencing any physical symptoms?',
    options: ['None', 'Mild symptoms', 'Moderate symptoms', 'Severe symptoms', 'Emergency symptoms'],
    category: 'physical_health'
  },
  {
    id: '3',
    question: 'How urgent is your concern?',
    options: ['Can wait a week', 'Within a few days', 'Within 24 hours', 'Within a few hours', 'Right now'],
    category: 'urgent'
  },
  {
    id: '4',
    question: 'What type of support are you looking for?',
    options: ['Talk therapy', 'Medication review', 'Health checkup', 'Wellness coaching', 'Emergency care'],
    category: 'wellness'
  }
];

export default function AIAssessment() {
  const { user } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
    
    if (currentQuestion < assessmentQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const getRecommendation = () => {
    const mentalHealthAnswers = Object.entries(answers).filter(([questionId]) => 
      assessmentQuestions.find(q => q.id === questionId)?.category === 'mental_health'
    );
    
    const urgencyAnswers = Object.entries(answers).filter(([questionId]) => 
      assessmentQuestions.find(q => q.id === questionId)?.category === 'urgent'
    );

    const supportAnswers = Object.entries(answers).filter(([questionId]) => 
      assessmentQuestions.find(q => q.id === questionId)?.category === 'wellness'
    );

    // Simple logic for demonstration
    if (urgencyAnswers.some(([, answer]) => answer === 'Right now' || answer === 'Within a few hours')) {
      return {
        service: 'Emergency Mental Health',
        provider: 'Dr. James Martinez, MD - Veteran Psychiatrist',
        reason: 'Based on your urgent needs and veteran status',
        urgency: 'high',
        matchReason: '🎖️ Veteran-matched provider with emergency training',
        tags: ['Veteran', 'Emergency', 'PTSD Specialist']
      };
    }

    if (supportAnswers.some(([, answer]) => answer === 'Talk therapy')) {
      return {
        service: 'Mental Health Therapy',
        provider: 'Dr. Sarah Kim, LCSW - Veteran Therapist',
        reason: 'Based on your preference for talk therapy and veteran background',
        urgency: 'medium',
        matchReason: '🎖️ Perfect match - Veteran therapist specializing in military trauma',
        tags: ['Veteran', 'PTSD', 'CBT', 'Military Experience']
      };
    }

    return {
      service: 'General Mental Health Consultation',
      provider: 'Dr. Michael Chen, MD - Veteran Psychiatrist',
      reason: 'Based on your veteran status and mental health needs',
      urgency: 'low',
      matchReason: '🎖️ Veteran-matched provider for comprehensive care',
      tags: ['Veteran', 'Military Background', 'General Psychiatry']
    };
  };

  const resetAssessment = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
  };

  const recommendation = showResults ? getRecommendation() : null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Card className="hover:shadow-md transition-shadow cursor-pointer border-2 border-dashed border-blue-200 bg-blue-50/50">
          <CardContent className="p-6 text-center">
            <Brain className="h-12 w-12 mx-auto mb-4 text-blue-600" />
            <h3 className="font-semibold text-lg mb-2">AI Health Assessment</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Get personalized care recommendations based on your needs
            </p>
            <Button className="w-full">
              <Brain className="h-4 w-4 mr-2" />
              Start Assessment
            </Button>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Health Assessment
          </DialogTitle>
          <DialogDescription>
            Answer a few questions to get personalized care recommendations
          </DialogDescription>
        </DialogHeader>

        {!showResults ? (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Question {currentQuestion + 1} of {assessmentQuestions.length}</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / assessmentQuestions.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                {assessmentQuestions[currentQuestion].question}
              </h3>
              
              <div className="grid gap-3">
                {assessmentQuestions[currentQuestion].options.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="justify-start text-left h-auto p-4"
                    onClick={() => handleAnswer(assessmentQuestions[currentQuestion].id, option)}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>

            {user?.profile?.tags && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm font-medium mb-2">Your Profile Tags:</p>
                <div className="flex gap-2 flex-wrap">
                  {user.profile.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                      {tag === 'Veteran' && '🎖️'} {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-600" />
              <h3 className="text-xl font-semibold mb-2">Assessment Complete!</h3>
              <p className="text-muted-foreground">Here's your personalized recommendation:</p>
            </div>

            {recommendation && (
              <Card className="border-2 border-green-200 bg-green-50/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-green-600" />
                    Recommended Service
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-lg">{recommendation.service}</h4>
                    <p className="text-muted-foreground">{recommendation.reason}</p>
                  </div>

                  <div className="bg-white p-4 rounded-lg border">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Stethoscope className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h5 className="font-semibold">{recommendation.provider}</h5>
                        <p className="text-sm text-green-600 font-medium">
                          {recommendation.matchReason}
                        </p>
                        <div className="flex gap-2 mt-2 flex-wrap">
                          {recommendation.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag === 'Veteran' && '🎖️'} {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button className="flex-1">
                      <Video className="h-4 w-4 mr-2" />
                      Start Instant Visit
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Clock className="h-4 w-4 mr-2" />
                      Schedule Later
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex gap-3">
              <Button variant="outline" onClick={resetAssessment} className="flex-1">
                Take Again
              </Button>
              <Button onClick={() => setIsOpen(false)} className="flex-1">
                Continue
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}