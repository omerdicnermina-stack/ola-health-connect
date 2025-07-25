import React, { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Clock, 
  Search, 
  Filter, 
  Video, 
  UserPlus, 
  ArrowUp, 
  ArrowDown,
  Phone,
  Calendar,
  Stethoscope
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
  const { hasPermission, currentUser } = useUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

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

  const canAssignProvider = currentUser?.role === 'Admin' || currentUser?.role === 'Super Admin' || currentUser?.role === 'Provider-Admin';

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
                    <Button size="sm" variant="default" className="h-8">
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

              {/* Queue Management Actions for Admins */}
              {canAssignProvider && (
                <div className="mt-4 pt-4 border-t flex gap-2">
                  <Button size="sm" variant="ghost" className="h-8">
                    <ArrowUp className="h-3 w-3 mr-1" />
                    Move Up
                  </Button>
                  <Button size="sm" variant="ghost" className="h-8">
                    <ArrowDown className="h-3 w-3 mr-1" />
                    Move Down
                  </Button>
                  <Button size="sm" variant="ghost" className="h-8">
                    <Phone className="h-3 w-3 mr-1" />
                    Call Patient
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

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