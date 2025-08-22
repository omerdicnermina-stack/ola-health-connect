import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff,
  Bot,
  FileText,
  Heart,
  Brain,
  Clock,
  User,
  Shield,
  Volume2,
  VolumeX,
  MessageSquare,
  CheckCircle,
  Activity
} from 'lucide-react';

interface Provider {
  provider: string;
  specialty: string;
  matchScore: number;
  reason: string;
  tags?: string[];
}

interface VideoCallInterfaceProps {
  provider: Provider | null;
  onEndCall: () => void;
  isVeteran: boolean;
}

interface PastVisitNote {
  id: string;
  date: string;
  provider: string;
  type: string;
  summary: string;
  keyPoints: string[];
  nextSteps: string[];
}

const pastVisitNotes: PastVisitNote[] = [
  {
    id: '1',
    date: '2024-12-15',
    provider: 'Dr. Sarah Johnson',
    type: 'Annual Checkup',
    summary: 'Routine health examination. Overall good health with minor recommendations.',
    keyPoints: [
      'Blood pressure: 118/76 (Normal)',
      'Weight: 165 lbs (Healthy range)',
      'Sleep patterns improved since last visit',
      'Stress levels manageable with current routine'
    ],
    nextSteps: [
      'Continue current exercise routine',
      'Schedule follow-up in 6 months',
      'Consider adding meditation to daily routine'
    ]
  },
  {
    id: '2',
    date: '2024-11-20',
    provider: 'Dr. Michael Brown',
    type: 'Mental Health Follow-up',
    summary: 'Progress check on anxiety management strategies. Positive improvement noted.',
    keyPoints: [
      'Anxiety symptoms reduced by 40%',
      'Sleep quality significantly improved',
      'Coping strategies working well',
      'Work-life balance better managed'
    ],
    nextSteps: [
      'Continue current therapy techniques',
      'Reduce session frequency to bi-weekly',
      'Practice mindfulness exercises daily'
    ]
  }
];

export default function VideoCallInterface({ provider, onEndCall, isVeteran }: VideoCallInterfaceProps) {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [currentNotes, setCurrentNotes] = useState<string[]>([]);
  const [careCompanionActive, setCareCompanionActive] = useState(true);
  const [showPastNotes, setShowPastNotes] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Start call timer
    intervalRef.current = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    // Simulate AI Care Companion taking notes
    const noteInterval = setInterval(() => {
      const sampleNotes = [
        "Patient reports feeling less anxious since last visit",
        "Sleep patterns have improved with meditation practice", 
        "Work stress more manageable with coping strategies",
        "Physical activity increased to 4x per week",
        "No side effects from current medication",
        "Expresses interest in veteran support groups",
        "Mood appears stable and positive",
        "Good eye contact and engagement throughout session"
      ];
      
      setCurrentNotes(prev => {
        const randomNote = sampleNotes[Math.floor(Math.random() * sampleNotes.length)];
        if (!prev.includes(randomNote)) {
          return [...prev, randomNote];
        }
        return prev;
      });
    }, 8000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      clearInterval(noteInterval);
    };
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    onEndCall();
  };

  return (
    <div className="space-y-4">
      {/* Video Call Header */}
      <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold">{provider?.provider}</h3>
            <p className="text-sm text-muted-foreground">{provider?.specialty}</p>
            {isVeteran && (
              <Badge className="text-xs bg-amber-100 text-amber-800 mt-1">
                🎖️ Veteran Care
              </Badge>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{formatDuration(callDuration)}</span>
          </div>
          <div className="flex items-center gap-1 mt-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-600">Live</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Video Call Area */}
        <div className="lg:col-span-2 space-y-4">
          {/* Main Video */}
          <Card>
            <CardContent className="p-0">
              <div className="relative bg-gray-900 rounded-lg aspect-video flex items-center justify-center">
                {isVideoOn ? (
                  <div className="text-white text-center">
                    <User className="h-16 w-16 mx-auto mb-2 opacity-75" />
                    <p className="text-sm opacity-75">Dr. {provider?.provider?.split(' ')[1]} is on video</p>
                  </div>
                ) : (
                  <div className="text-white text-center">
                    <VideoOff className="h-16 w-16 mx-auto mb-2 opacity-75" />
                    <p className="text-sm opacity-75">Video is off</p>
                  </div>
                )}
                
                {/* Patient Video (Picture-in-Picture) */}
                <div className="absolute bottom-4 right-4 w-32 h-24 bg-blue-600 rounded-lg flex items-center justify-center">
                  <div className="text-white text-center">
                    <User className="h-8 w-8 mx-auto mb-1" />
                    <p className="text-xs">You</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Call Controls */}
          <div className="flex justify-center gap-4">
            <Button
              variant={isVideoOn ? "default" : "destructive"}
              size="lg"
              className="rounded-full w-14 h-14"
              onClick={() => setIsVideoOn(!isVideoOn)}
            >
              {isVideoOn ? <Video className="h-6 w-6" /> : <VideoOff className="h-6 w-6" />}
            </Button>
            
            <Button
              variant={isAudioOn ? "default" : "destructive"}
              size="lg"
              className="rounded-full w-14 h-14"
              onClick={() => setIsAudioOn(!isAudioOn)}
            >
              {isAudioOn ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
            </Button>
            
            <Button
              variant={isSpeakerOn ? "default" : "secondary"}
              size="lg"
              className="rounded-full w-14 h-14"
              onClick={() => setIsSpeakerOn(!isSpeakerOn)}
            >
              {isSpeakerOn ? <Volume2 className="h-6 w-6" /> : <VolumeX className="h-6 w-6" />}
            </Button>
            
            <Button
              variant="destructive"
              size="lg"
              className="rounded-full w-14 h-14"
              onClick={handleEndCall}
            >
              <PhoneOff className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* AI Care Companion & Notes Panel */}
        <div className="space-y-4">
          {/* AI Care Companion */}
          <Card className="border-purple-200 bg-purple-50/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Bot className="h-5 w-5 text-purple-600" />
                OLA Care Companion
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-600">Active</span>
                </div>
              </CardTitle>
              <CardDescription>
                AI assistant monitoring your session
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="bg-white p-3 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium">Real-time Insights</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Monitoring conversation for key health indicators and treatment progress
                </p>
              </div>
              
              <div className="bg-white p-3 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Note Taking</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Automatically documenting important medical information and next steps
                </p>
              </div>

              {isVeteran && (
                <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-amber-600" />
                    <span className="text-sm font-medium">Veteran-Aware AI</span>
                  </div>
                  <p className="text-xs text-amber-700">
                    Understanding military context and veteran-specific health concerns
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Live Notes */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Live Session Notes
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPastNotes(!showPastNotes)}
                >
                  {showPastNotes ? 'Hide' : 'Show'} Past Notes
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-48">
                <div className="space-y-2">
                  {currentNotes.map((note, index) => (
                    <div key={index} className="flex items-start gap-2 p-2 bg-blue-50 rounded-lg">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm">{note}</p>
                    </div>
                  ))}
                  {currentNotes.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      AI Care Companion will document key points as the session progresses...
                    </p>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Past Visit Notes */}
          {showPastNotes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Previous Visit Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-4">
                    {pastVisitNotes.map((visit) => (
                      <div key={visit.id} className="border rounded-lg p-3 space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-sm">{visit.type}</h4>
                            <p className="text-xs text-muted-foreground">{visit.provider}</p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {visit.date}
                          </Badge>
                        </div>
                        <p className="text-xs">{visit.summary}</p>
                        
                        <div className="space-y-1">
                          <p className="text-xs font-medium">Key Points:</p>
                          {visit.keyPoints.slice(0, 2).map((point, idx) => (
                            <p key={idx} className="text-xs text-muted-foreground">• {point}</p>
                          ))}
                          {visit.keyPoints.length > 2 && (
                            <p className="text-xs text-blue-600">+{visit.keyPoints.length - 2} more...</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Session Summary Footer */}
      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <div className="flex items-center gap-2 mb-2">
          <Activity className="h-5 w-5 text-green-600" />
          <span className="font-medium text-green-800">Session in Progress</span>
        </div>
        <p className="text-sm text-green-700">
          OLA Care Companion is actively monitoring and documenting this session. 
          All notes will be available in your medical records after the call.
        </p>
      </div>
    </div>
  );
}