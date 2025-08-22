import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Clock, 
  Search, 
  Filter, 
  Video, 
  UserPlus, 
  Phone,
  Calendar,
  Stethoscope,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
  FileText,
  User,
  MapPin,
  Bot,
  Ear,
  MessageSquare,
  CheckCircle2,
  Activity,
  Droplets,
  Moon,
  Coffee
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface QueuePatient {
  id: string;
  name: string;
  avatar?: string;
  dateTime: string;
  provider?: string;
  service: string;
  visitType: 'Urgent' | 'Routine' | 'Follow-up' | 'Consultation';
  waitTime: number; // in minutes
  priority: 'High' | 'Medium' | 'Low';
  status: 'Waiting' | 'In Progress' | 'Ready' | 'Assigned';
  age: number;
  phone: string;
  reason: string;
}

const mockQueueData: QueuePatient[] = [
  {
    id: '1',
    name: 'John Doe',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
    dateTime: '2024-01-25 14:30',
    provider: 'Dr. Sarah Johnson',
    service: 'General Consultation',
    visitType: 'Urgent',
    waitTime: 15,
    priority: 'High',
    status: 'Waiting',
    age: 34,
    phone: '+1 (555) 123-4567',
    reason: 'Chest pain and shortness of breath'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=32&h=32&fit=crop&crop=face',
    dateTime: '2024-01-25 14:45',
    provider: 'Dr. Mike Wilson',
    service: 'Prescription Review',
    visitType: 'Follow-up',
    waitTime: 8,
    priority: 'Medium',
    status: 'In Progress',
    age: 28,
    phone: '+1 (555) 234-5678',
    reason: 'Medication refill and side effects discussion'
  },
  {
    id: '3',
    name: 'Mike Wilson',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
    dateTime: '2024-01-25 15:00',
    service: 'Mental Health',
    visitType: 'Routine',
    waitTime: 22,
    priority: 'Low',
    status: 'Ready',
    age: 45,
    phone: '+1 (555) 345-6789',
    reason: 'Anxiety and stress management consultation'
  },
  {
    id: '4',
    name: 'Emily Davis',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face',
    dateTime: '2024-01-25 15:15',
    provider: 'Dr. Sarah Johnson',
    service: 'Dermatology',
    visitType: 'Consultation',
    waitTime: 5,
    priority: 'Medium',
    status: 'Assigned',
    age: 31,
    phone: '+1 (555) 456-7890',
    reason: 'Skin rash and irritation concerns'
  }
];

export default function VirtualQueue() {
  const { hasPermission, user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [callModalOpen, setCallModalOpen] = useState(false);
  const [currentCallPatient, setCurrentCallPatient] = useState<QueuePatient | null>(null);
  const [callStarted, setCallStarted] = useState(false);
  const [micMuted, setMicMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  const [callNotes, setCallNotes] = useState('');
  const [olaCompanionActive, setOlaCompanionActive] = useState(false);
  const [olaListening, setOlaListening] = useState(false);
  const [olaTranscript, setOlaTranscript] = useState('');
  const [olaNotes, setOlaNotes] = useState('');
  const [followUpPlan, setFollowUpPlan] = useState('');

  if (!hasPermission('virtual_queue')) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">You don't have permission to access the virtual queue.</p>
      </div>
    );
  }

  const filteredPatients = mockQueueData.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || patient.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || patient.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'High': return 'destructive';
      case 'Medium': return 'default';
      case 'Low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Waiting': return 'outline';
      case 'In Progress': return 'default';
      case 'Ready': return 'secondary';
      case 'Assigned': return 'outline';
      default: return 'outline';
    }
  };

  const canAssignProvider = user?.profile?.role === 'Admin' || user?.profile?.role === 'Super Admin' || user?.profile?.role === 'Provider-Admin';

  const handleStartCall = (patient: QueuePatient) => {
    setCurrentCallPatient(patient);
    setCallModalOpen(true);
    setCallStarted(false);
    setMicMuted(false);
    setVideoOff(false);
    setCallNotes('');
    setOlaCompanionActive(false);
    setOlaListening(false);
    setOlaTranscript('');
    setOlaNotes('');
    setFollowUpPlan('');
  };

  const handleJoinCall = () => {
    setCallStarted(true);
  };

  const handleEndCall = () => {
    setCallModalOpen(false);
    setCurrentCallPatient(null);
    setCallStarted(false);
    setOlaCompanionActive(false);
    setOlaListening(false);
  };

  const toggleOlaCompanion = () => {
    setOlaCompanionActive(!olaCompanionActive);
    if (!olaCompanionActive) {
      setOlaListening(true);
      // Simulate AI listening and taking notes
      setOlaTranscript('OLA is now listening to the conversation...');
      setTimeout(() => {
        setOlaTranscript('Patient discussing chest pain symptoms, occurred 2 hours ago...');
        setOlaNotes('• Chief complaint: Chest pain\n• Onset: 2 hours ago\n• Severity: 7/10\n• Associated symptoms: Shortness of breath\n• Patient reports anxiety about symptoms');
      }, 3000);
    } else {
      setOlaListening(false);
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Virtual Queue</h1>
          <p className="text-muted-foreground">
            Manage patient queue and consultations in real-time
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm">
            {filteredPatients.length} patients in queue
          </Badge>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search patients by name or reason..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Waiting">Waiting</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Ready">Ready</SelectItem>
                <SelectItem value="Assigned">Assigned</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Queue List */}
      <div className="space-y-4">
        {filteredPatients.map((patient) => (
          <Card key={patient.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                {/* Patient Info */}
                <div className="lg:col-span-3 flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={patient.avatar} />
                    <AvatarFallback>{patient.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{patient.name}</h3>
                    <p className="text-sm text-muted-foreground">Age: {patient.age}</p>
                    <p className="text-xs text-muted-foreground">{patient.phone}</p>
                  </div>
                </div>

                {/* Date & Time */}
                <div className="lg:col-span-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{patient.dateTime.split(' ')[0]}</p>
                      <p className="text-muted-foreground">{patient.dateTime.split(' ')[1]}</p>
                    </div>
                  </div>
                </div>

                {/* Provider */}
                <div className="lg:col-span-2">
                  <div className="flex items-center gap-2">
                    <Stethoscope className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{patient.provider || 'Unassigned'}</p>
                    </div>
                  </div>
                </div>

                {/* Service & Visit Type */}
                <div className="lg:col-span-2">
                  <p className="text-sm font-medium">{patient.service}</p>
                  <Badge variant="outline" className="text-xs mt-1">
                    {patient.visitType}
                  </Badge>
                </div>

                {/* Wait Time & Priority */}
                <div className="lg:col-span-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{patient.waitTime}m</span>
                  </div>
                  <Badge variant={getPriorityVariant(patient.priority)} className="text-xs">
                    {patient.priority}
                  </Badge>
                </div>

                {/* Status & Actions */}
                <div className="lg:col-span-2 flex flex-col gap-2">
                  <Badge variant={getStatusVariant(patient.status)} className="w-fit">
                    {patient.status}
                  </Badge>
                  <div className="flex flex-wrap gap-1">
                    <Button 
                      size="sm" 
                      variant="default" 
                      className="h-8"
                      onClick={() => handleStartCall(patient)}
                    >
                      <Video className="h-3 w-3 mr-1" />
                      Start Call
                    </Button>
                    {canAssignProvider && !patient.provider && (
                      <Button size="sm" variant="outline" className="h-8">
                        <UserPlus className="h-3 w-3 mr-1" />
                        Assign
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Reason */}
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm">
                  <span className="font-medium">Reason:</span> {patient.reason}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Enhanced Call Modal */}
      <Dialog open={callModalOpen} onOpenChange={setCallModalOpen}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              Video Consultation - {currentCallPatient?.name}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Video Section */}
            <div className="lg:col-span-2 space-y-4">
              {/* Video Windows */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Patient Video */}
                <div className="relative bg-gray-900 rounded-lg aspect-video overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center p-4">
                    {callStarted ? (
                      <div className="text-center text-white">
                        <Avatar className="h-16 w-16 mx-auto mb-3">
                          <AvatarImage src={currentCallPatient?.avatar} className="object-cover" />
                          <AvatarFallback className="text-lg bg-primary">
                            {currentCallPatient?.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <p className="text-lg font-semibold">{currentCallPatient?.name}</p>
                        <p className="text-sm text-gray-300">Patient</p>
                        <div className="mt-3 flex items-center justify-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-sm">Connected</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-white">
                        <Avatar className="h-16 w-16 mx-auto mb-3">
                          <AvatarImage src={currentCallPatient?.avatar} className="object-cover" />
                          <AvatarFallback className="text-lg bg-primary">
                            {currentCallPatient?.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <p className="text-lg font-semibold">{currentCallPatient?.name}</p>
                        <p className="text-sm text-gray-300">Waiting to join...</p>
                      </div>
                    )}
                  </div>
                  <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                    Patient
                  </div>
                </div>

                {/* Provider Video */}
                <div className="relative bg-gray-800 rounded-lg aspect-video overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center p-4">
                    {videoOff ? (
                      <div className="text-center text-white">
                         <Avatar className="h-16 w-16 mx-auto mb-3">
                           <AvatarImage src={user?.profile?.avatar} className="object-cover" />
                           <AvatarFallback className="text-lg bg-secondary">
                             {user?.profile?.name.split(' ').map(n => n[0]).join('')}
                           </AvatarFallback>
                         </Avatar>
                         <p className="text-lg font-semibold">{user?.profile?.name}</p>
                        <p className="text-sm text-gray-300">Video Off</p>
                      </div>
                    ) : (
                      <div className="text-center text-white">
                         <Avatar className="h-16 w-16 mx-auto mb-3">
                           <AvatarImage src={user?.profile?.avatar} className="object-cover" />
                           <AvatarFallback className="text-lg bg-secondary">
                             {user?.profile?.name.split(' ').map(n => n[0]).join('')}
                           </AvatarFallback>
                         </Avatar>
                         <p className="text-lg font-semibold">{user?.profile?.name}</p>
                        <p className="text-sm text-gray-300">Provider</p>
                      </div>
                    )}
                  </div>
                  <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                    You ({user?.profile?.role})
                  </div>
                </div>
              </div>

              {/* Call Controls */}
              <div className="flex items-center justify-center gap-4 p-4 bg-muted rounded-lg">
                {!callStarted ? (
                  <Button onClick={handleJoinCall} className="bg-green-600 hover:bg-green-700">
                    <Video className="h-4 w-4 mr-2" />
                    Join Call
                  </Button>
                ) : (
                  <>
                    <Button
                      variant={micMuted ? "destructive" : "outline"}
                      size="sm"
                      onClick={() => setMicMuted(!micMuted)}
                    >
                      {micMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </Button>
                    
                    <Button
                      variant={videoOff ? "destructive" : "outline"}
                      size="sm"
                      onClick={() => setVideoOff(!videoOff)}
                    >
                      {videoOff ? <VideoOff className="h-4 w-4" /> : <Video className="h-4 w-4" />}
                    </Button>
                    
                     <Button
                       variant={olaCompanionActive ? "default" : "outline"}
                       size="sm"
                       onClick={toggleOlaCompanion}
                       className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0"
                     >
                       <Bot className="h-4 w-4 mr-2" />
                       OLA Companion
                     </Button>
                     
                     <Button
                       variant="destructive"
                       size="sm"
                       onClick={handleEndCall}
                     >
                       <PhoneOff className="h-4 w-4 mr-2" />
                       End Call
                     </Button>
                   </>
                 )}
               </div>

              {/* Notes Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Call Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Enter consultation notes, diagnosis, treatment plan, prescriptions, etc..."
                    value={callNotes}
                    onChange={(e) => setCallNotes(e.target.value)}
                    rows={6}
                    className="resize-none"
                  />
                  <div className="flex justify-end mt-3">
                    <Button size="sm" variant="outline">
                      Save Notes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* OLA Care Companion */}
            <div className="space-y-4">
              {olaCompanionActive && (
                <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-700">
                      <Bot className="h-5 w-5" />
                      OLA Care Companion
                      {olaListening && (
                        <div className="flex items-center gap-1 ml-auto">
                          <Ear className="h-4 w-4 text-green-600" />
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        </div>
                      )}
                    </CardTitle>
                    <CardDescription className="text-blue-600">
                      AI assistant listening and taking HIPAA-compliant notes
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Live Transcript */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-700">Live Transcript</span>
                      </div>
                      <div className="bg-white p-3 rounded-lg border text-sm max-h-24 overflow-y-auto">
                        {olaTranscript || 'Waiting for conversation to start...'}
                      </div>
                    </div>

                    {/* AI Notes */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-700">AI Notes</span>
                      </div>
                      <div className="bg-white p-3 rounded-lg border text-sm max-h-32 overflow-y-auto">
                        <pre className="whitespace-pre-wrap font-sans">
                          {olaNotes || 'OLA will generate structured notes from the conversation...'}
                        </pre>
                      </div>
                    </div>

                    {/* Post-Visit Follow-up Plan */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-700">Follow-up Plan</span>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg border border-green-200 text-sm">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Droplets className="h-3 w-3 text-blue-500" />
                            <span className="text-xs">Hydration reminders: 8 glasses daily</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Moon className="h-3 w-3 text-purple-500" />
                            <span className="text-xs">Sleep tracking: 7-8 hours nightly</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Activity className="h-3 w-3 text-orange-500" />
                            <span className="text-xs">Exercise reminder: 30min walk daily</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Coffee className="h-3 w-3 text-green-500" />
                            <span className="text-xs">Wellness check-in: 48 hours</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Compare Notes */}
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        Compare Notes
                      </Button>
                      <Button size="sm" variant="default" className="flex-1 bg-blue-600 hover:bg-blue-700">
                        Export Notes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Information Sidebar */}
            <div className="space-y-4">
              {/* Patient Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Patient Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={currentCallPatient?.avatar} />
                      <AvatarFallback>
                        {currentCallPatient?.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{currentCallPatient?.name}</p>
                      <p className="text-sm text-muted-foreground">Age: {currentCallPatient?.age}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Phone:</span>
                      <span>{currentCallPatient?.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Priority:</span>
                      <Badge variant={getPriorityVariant(currentCallPatient?.priority || 'Low')}>
                        {currentCallPatient?.priority}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Wait Time:</span>
                      <span>{currentCallPatient?.waitTime}m</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Provider Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Stethoscope className="h-4 w-4" />
                    Provider Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user?.profile?.avatar} />
                      <AvatarFallback>
                        {user?.profile?.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{user?.profile?.name}</p>
                      <p className="text-sm text-muted-foreground">{user?.profile?.role}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Organization:</span>
                      <span>{user?.profile?.organization}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Visit Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Visit Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date:</span>
                      <span>{currentCallPatient?.dateTime.split(' ')[0]}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Time:</span>
                      <span>{currentCallPatient?.dateTime.split(' ')[1]}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Service:</span>
                      <span>{currentCallPatient?.service}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Visit Type:</span>
                      <Badge variant="outline">{currentCallPatient?.visitType}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge variant={getStatusVariant(currentCallPatient?.status || 'Waiting')}>
                        {currentCallPatient?.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="pt-3 border-t">
                    <p className="text-sm font-medium mb-1">Chief Complaint:</p>
                    <p className="text-sm text-muted-foreground">{currentCallPatient?.reason}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {filteredPatients.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No patients in queue</h3>
            <p className="text-muted-foreground">
              {searchTerm || filterStatus !== 'all' || filterPriority !== 'all' 
                ? 'No patients match your current filters.' 
                : 'The virtual queue is currently empty.'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}