import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Brain, 
  Heart, 
  Stethoscope, 
  Video,
  Phone,
  Shield,
  Clock,
  User,
  Star,
  CheckCircle,
  Zap
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface Provider {
  id: string;
  name: string;
  specialty: string;
  tags: string[];
  rating: number;
  available: boolean;
  image: string;
  experience: string;
  matchScore: number;
  matchReason: string;
}

const mockProviders: Provider[] = [
  {
    id: '1',
    name: 'Dr. James Martinez, MD',
    specialty: 'Psychiatrist - Veteran Mental Health',
    tags: ['Veteran', 'PTSD Specialist', 'Military Experience', 'Emergency Care'],
    rating: 4.9,
    available: true,
    image: '👨🏽‍⚕️',
    experience: '15+ years treating veterans',
    matchScore: 98,
    matchReason: 'Perfect match - Veteran psychiatrist with military trauma expertise'
  },
  {
    id: '2',
    name: 'Dr. Sarah Kim, LCSW',
    specialty: 'Licensed Clinical Social Worker',
    tags: ['Veteran', 'CBT', 'Military Families', 'PTSD'],
    rating: 4.8,
    available: true,
    image: '👩🏻‍⚕️',
    experience: '12+ years in veteran therapy',
    matchScore: 95,
    matchReason: 'Excellent match - Veteran therapist specializing in CBT for military trauma'
  },
  {
    id: '3',
    name: 'Dr. Michael Chen, MD',
    specialty: 'General Psychiatrist',
    tags: ['Veteran', 'General Psychiatry', 'Medication Management'],
    rating: 4.7,
    available: false,
    image: '👨🏻‍⚕️',
    experience: '10+ years veteran care',
    matchScore: 88,
    matchReason: 'Good match - Veteran psychiatrist for comprehensive care'
  }
];

export default function InstantMentalHealthVisit() {
  const { user } = useAuth();
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const userTags = user?.profile?.tags || [];
  const isVeteran = userTags.includes('Veteran');

  // Sort providers by match score for veterans
  const sortedProviders = isVeteran 
    ? mockProviders.sort((a, b) => b.matchScore - a.matchScore)
    : mockProviders;

  const handleStartVisit = async (provider: Provider) => {
    setSelectedProvider(provider);
    setIsConnecting(true);
    
    // Simulate connection delay
    setTimeout(() => {
      setIsConnecting(false);
      setIsOpen(false);
      // In real app, this would redirect to video call interface
      alert(`Connecting you with ${provider.name} for your mental health session...`);
    }, 3000);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  if (isConnecting && selectedProvider) {
    return (
      <Dialog open={true} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-[400px]">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Connecting to your session</h3>
              <p className="text-muted-foreground">Setting up secure video call with {selectedProvider.name}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                🎖️ You've been matched with a veteran mental health specialist
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Card className="hover:shadow-md transition-shadow cursor-pointer border-2 border-red-200 bg-red-50/50">
          <CardContent className="p-6 text-center">
            <div className="relative">
              <Brain className="h-12 w-12 mx-auto mb-4 text-red-600" />
              {isVeteran && (
                <div className="absolute -top-2 -right-2">
                  <Shield className="h-6 w-6 text-amber-600" />
                </div>
              )}
            </div>
            <h3 className="font-semibold text-lg mb-2">Instant Mental Health Visit</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {isVeteran 
                ? 'Connect with veteran mental health specialists immediately'
                : 'Connect with mental health professionals immediately'
              }
            </p>
            <Button className="w-full bg-red-600 hover:bg-red-700">
              <Zap className="h-4 w-4 mr-2" />
              Start Now
            </Button>
            {isVeteran && (
              <div className="mt-3">
                <Badge className="bg-amber-100 text-amber-800">
                  🎖️ Veteran Priority Access
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Instant Mental Health Visit
            {isVeteran && <Shield className="h-5 w-5 text-amber-600" />}
          </DialogTitle>
          <DialogDescription>
            {isVeteran 
              ? 'Connect immediately with veteran mental health specialists who understand your background'
              : 'Connect immediately with available mental health professionals'
            }
          </DialogDescription>
        </DialogHeader>

        {isVeteran && (
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-5 w-5 text-amber-600" />
              <span className="font-semibold text-amber-800">Veteran Priority Matching</span>
            </div>
            <p className="text-sm text-amber-700">
              You've been prioritized to connect with mental health providers who have military experience 
              and specialize in veteran care.
            </p>
          </div>
        )}

        <div className="space-y-4">
          <h3 className="font-semibold">Available Providers</h3>
          
          {sortedProviders.map((provider) => (
            <Card key={provider.id} className={`transition-all duration-200 ${
              provider.available 
                ? 'border-green-200 hover:border-green-300' 
                : 'border-gray-200 opacity-75'
            } ${isVeteran && provider.tags.includes('Veteran') ? 'ring-2 ring-amber-200' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                    {provider.image}
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold">{provider.name}</h4>
                        <p className="text-sm text-muted-foreground">{provider.specialty}</p>
                        <p className="text-xs text-muted-foreground">{provider.experience}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          {renderStars(provider.rating)}
                          <span className="text-sm font-medium ml-1">{provider.rating}</span>
                        </div>
                        {provider.available ? (
                          <Badge className="bg-green-100 text-green-800 mt-1">Available Now</Badge>
                        ) : (
                          <Badge variant="secondary" className="mt-1">Busy</Badge>
                        )}
                      </div>
                    </div>

                    {isVeteran && provider.tags.includes('Veteran') && (
                      <div className="bg-amber-50 p-3 rounded-md border border-amber-200">
                        <div className="flex items-center gap-2 mb-1">
                          <Shield className="h-4 w-4 text-amber-600" />
                          <span className="text-sm font-semibold text-amber-800">
                            {provider.matchScore}% Match
                          </span>
                        </div>
                        <p className="text-xs text-amber-700">{provider.matchReason}</p>
                      </div>
                    )}

                    <div className="flex gap-2 flex-wrap">
                      {provider.tags.map((tag, index) => (
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

                    <div className="flex gap-2 pt-2">
                      <Button 
                        size="sm" 
                        className="flex-1"
                        disabled={!provider.available}
                        onClick={() => handleStartVisit(provider)}
                      >
                        <Video className="h-4 w-4 mr-2" />
                        Start Video Call
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        disabled={!provider.available}
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Voice Call
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-5 w-5 text-blue-600" />
            <span className="font-semibold text-blue-800">What to Expect</span>
          </div>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Secure, HIPAA-compliant video session</li>
            <li>• No appointment needed - connect instantly</li>
            <li>• Session notes and follow-up care plan provided</li>
            {isVeteran && <li>• Veteran-specialized care and understanding</li>}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}