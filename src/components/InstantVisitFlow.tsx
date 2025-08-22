import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import VideoCallInterface from '@/components/VideoCallInterface';
import { 
  Brain, 
  Heart, 
  Stethoscope, 
  Activity, 
  Thermometer,
  Baby,
  Pill,
  Shield,
  ArrowRight,
  CheckCircle,
  Clock,
  Zap
} from 'lucide-react';

interface Service {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  urgency: 'low' | 'medium' | 'high';
  estimatedTime: string;
}

const services: Service[] = [
  {
    id: 'mental-health',
    name: 'Mental Health',
    description: 'Counseling, therapy, and psychiatric care',
    icon: Brain,
    color: 'text-purple-600 bg-purple-100',
    urgency: 'high',
    estimatedTime: '15-30 min'
  },
  {
    id: 'general-care',
    name: 'General Care',
    description: 'Primary care, checkups, and general health concerns',
    icon: Stethoscope,
    color: 'text-blue-600 bg-blue-100',
    urgency: 'medium',
    estimatedTime: '20-40 min'
  },
  {
    id: 'urgent-care',
    name: 'Urgent Care',
    description: 'Non-emergency urgent medical needs',
    icon: Activity,
    color: 'text-red-600 bg-red-100',
    urgency: 'high',
    estimatedTime: '10-20 min'
  },
  {
    id: 'pediatric',
    name: 'Pediatric Care',
    description: 'Healthcare for children and adolescents',
    icon: Baby,
    color: 'text-green-600 bg-green-100',
    urgency: 'medium',
    estimatedTime: '25-45 min'
  },
  {
    id: 'wellness',
    name: 'Wellness & Prevention',
    description: 'Preventive care and wellness consultations',
    icon: Heart,
    color: 'text-pink-600 bg-pink-100',
    urgency: 'low',
    estimatedTime: '30-45 min'
  }
];

interface AssessmentQuestion {
  id: string;
  question: string;
  options: { value: string; label: string; weight: number }[];
  category: 'urgency' | 'symptoms' | 'background' | 'preference';
}

const mentalHealthQuestions: AssessmentQuestion[] = [
  {
    id: 'urgency',
    question: 'How urgent is your need for mental health support?',
    options: [
      { value: 'immediate', label: 'I need help right now', weight: 10 },
      { value: 'today', label: 'Within the next few hours', weight: 8 },
      { value: 'soon', label: 'Within a day or two', weight: 5 },
      { value: 'routine', label: 'For routine care/check-in', weight: 2 }
    ],
    category: 'urgency'
  },
  {
    id: 'symptoms',
    question: 'What best describes your current concerns?',
    options: [
      { value: 'anxiety', label: 'Anxiety or panic symptoms', weight: 7 },
      { value: 'depression', label: 'Feeling down or depressed', weight: 6 },
      { value: 'trauma', label: 'Dealing with trauma or PTSD', weight: 9 },
      { value: 'stress', label: 'Work or life stress', weight: 4 },
      { value: 'relationships', label: 'Relationship issues', weight: 3 },
      { value: 'general', label: 'General mental wellness', weight: 2 }
    ],
    category: 'symptoms'
  },
  {
    id: 'background',
    question: 'Do you have military service background?',
    options: [
      { value: 'active', label: 'Currently serving', weight: 10 },
      { value: 'veteran', label: 'Military veteran', weight: 10 },
      { value: 'family', label: 'Military family member', weight: 5 },
      { value: 'none', label: 'No military connection', weight: 0 }
    ],
    category: 'background'
  },
  {
    id: 'preference',
    question: 'What type of support would be most helpful?',
    options: [
      { value: 'therapy', label: 'Talk therapy/counseling', weight: 5 },
      { value: 'medication', label: 'Medication evaluation', weight: 7 },
      { value: 'crisis', label: 'Crisis intervention', weight: 10 },
      { value: 'wellness', label: 'Wellness coaching', weight: 2 }
    ],
    category: 'preference'
  }
];

export default function InstantVisitFlow() {
  const { user } = useAuth();
  const [step, setStep] = useState<'service' | 'assessment' | 'matching' | 'provider' | 'video-call'>('service');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isOpen, setIsOpen] = useState(false);
  const [isMatching, setIsMatching] = useState(false);

  const isVeteran = user?.profile?.tags?.includes('Veteran');

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    if (service.id === 'mental-health') {
      setStep('assessment');
    } else {
      // For other services, go directly to provider matching
      setStep('matching');
      simulateMatching();
    }
  };

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
    
    if (currentQuestion < mentalHealthQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setStep('matching');
      simulateMatching();
    }
  };

  const simulateMatching = () => {
    setIsMatching(true);
    setTimeout(() => {
      setIsMatching(false);
      setStep('provider');
    }, 3000);
  };

  const getAIRecommendation = () => {
    if (!selectedService || selectedService.id !== 'mental-health') {
      return {
        provider: 'Dr. Maria Martinez, MD',
        specialty: 'General Practice',
        matchScore: 85,
        reason: 'Available now for general care'
      };
    }

    const urgencyAnswer = answers['urgency'];
    const symptomsAnswer = answers['symptoms'];
    const backgroundAnswer = answers['background'];
    
    // AI-powered matching logic
    if (isVeteran || backgroundAnswer === 'veteran' || backgroundAnswer === 'active') {
      if (symptomsAnswer === 'trauma' || urgencyAnswer === 'immediate') {
        return {
          provider: 'Dr. Maria Martinez, MD',
          specialty: 'Psychiatrist - Veteran Mental Health Specialist',
          matchScore: 98,
          reason: 'Perfect match - Mental health specialist with veteran care experience',
          tags: ['Veteran', 'Mental Health Specialist', 'Anxiety Management', 'Military Experience']
        };
      }
      return {
        provider: 'Dr. Sarah Kim, LCSW',
        specialty: 'Licensed Clinical Social Worker - Veteran Care',
        matchScore: 95,
        reason: 'Excellent match - Veteran therapist specializing in military mental health',
        tags: ['Veteran', 'CBT', 'Military Families', 'Anxiety/Depression']
      };
    }
    
    if (symptomsAnswer === 'anxiety' || symptomsAnswer === 'depression') {
      return {
        provider: 'Dr. Emily Chen, PhD',
        specialty: 'Clinical Psychologist',
        matchScore: 88,
        reason: 'Specialist in anxiety and depression with immediate availability',
        tags: ['Anxiety Disorders', 'Depression', 'CBT', 'Mindfulness']
      };
    }

    return {
      provider: 'Dr. Michael Brown, MD',
      specialty: 'General Psychiatrist',
      matchScore: 82,
      reason: 'Available psychiatrist for comprehensive mental health care',
      tags: ['General Psychiatry', 'Medication Management', 'Therapy']
    };
  };

  const resetFlow = () => {
    setStep('service');
    setSelectedService(null);
    setCurrentQuestion(0);
    setAnswers({});
    setIsMatching(false);
  };

  const startVideoCall = () => {
    setStep('video-call');
  };

  const recommendation = step === 'provider' ? getAIRecommendation() : null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full text-base py-4">
          <Zap className="h-5 w-5 mr-2" />
          Start Instant Visit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            {step === 'video-call' ? 'Video Call Session' : 'Instant Visit'}
            {isVeteran && <Shield className="h-5 w-5 text-amber-600" />}
          </DialogTitle>
          <DialogDescription>
            {step === 'service' && 'Select the type of care you need'}
            {step === 'assessment' && 'Answer a few questions for personalized care'}
            {step === 'matching' && 'Finding the best provider for you'}
            {step === 'provider' && 'Your matched healthcare provider'}
            {step === 'video-call' && 'Live video consultation with AI Care Companion'}
          </DialogDescription>
        </DialogHeader>

        {/* Service Selection */}
        {step === 'service' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">What type of care do you need today?</h3>
            <div className="grid gap-4">
              {services.map((service) => (
                <Card 
                  key={service.id} 
                  className="cursor-pointer hover:border-blue-300 transition-colors"
                  onClick={() => handleServiceSelect(service)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${service.color}`}>
                        <service.icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{service.name}</h4>
                        <p className="text-sm text-muted-foreground">{service.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {service.estimatedTime}
                          </Badge>
                          {service.urgency === 'high' && (
                            <Badge className="text-xs bg-red-100 text-red-800">Priority</Badge>
                          )}
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Assessment Questions */}
        {step === 'assessment' && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Question {currentQuestion + 1} of {mentalHealthQuestions.length}</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / mentalHealthQuestions.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                {mentalHealthQuestions[currentQuestion].question}
              </h3>
              
              <div className="grid gap-3">
                {mentalHealthQuestions[currentQuestion].options.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="justify-start text-left h-auto p-4 hover:bg-blue-50"
                    onClick={() => handleAnswer(mentalHealthQuestions[currentQuestion].id, option.value)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            {isVeteran && (
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-5 w-5 text-amber-600" />
                  <span className="font-semibold text-amber-800">Veteran Priority Matching</span>
                </div>
                <p className="text-sm text-amber-700">
                  Your responses will help us match you with providers who understand military experience.
                </p>
              </div>
            )}
          </div>
        )}

        {/* AI Matching */}
        {step === 'matching' && (
          <div className="text-center space-y-6 py-8">
            <div className="w-20 h-20 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">AI Matching in Progress</h3>
              <p className="text-muted-foreground">
                Analyzing your needs and finding the best available provider...
              </p>
            </div>
            {isVeteran && (
              <div className="bg-amber-50 p-4 rounded-lg">
                <p className="text-sm text-amber-800">
                  🎖️ Prioritizing veteran-experienced providers
                </p>
              </div>
            )}
          </div>
        )}

        {/* Provider Match */}
        {step === 'provider' && recommendation && (
          <div className="space-y-6">
            <div className="text-center">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-600" />
              <h3 className="text-xl font-semibold mb-2">Perfect Match Found!</h3>
              <p className="text-muted-foreground">AI has matched you with the ideal provider</p>
            </div>

            <Card className="border-2 border-green-200 bg-green-50/50">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                    👨‍⚕️
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-xl font-semibold">{recommendation.provider}</h4>
                      <Badge className="bg-green-100 text-green-800">
                        {recommendation.matchScore}% Match
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-3">{recommendation.specialty}</p>
                    <p className="text-sm text-green-700 font-medium mb-4">
                      🤖 AI Reason: {recommendation.reason}
                    </p>
                    
                    {recommendation.tags && (
                      <div className="flex gap-2 flex-wrap mb-4">
                        {recommendation.tags.map((tag, index) => (
                          <Badge 
                            key={index} 
                            variant="outline" 
                            className={`text-xs ${
                              tag === 'Veteran' ? 'border-amber-300 text-amber-700 bg-amber-50' : ''
                            }`}
                          >
                            {tag === 'Veteran' && '🎖️'} {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-3">
                      <Button className="flex-1" onClick={startVideoCall}>
                        Start Video Call Now
                      </Button>
                      <Button variant="outline" onClick={resetFlow}>
                        Choose Different Service
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Video Call Interface */}
        {step === 'video-call' && (
          <VideoCallInterface 
            provider={recommendation}
            onEndCall={() => {
              resetFlow();
              setIsOpen(false); // Close dialog and return to dashboard
            }}
            isVeteran={isVeteran}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}