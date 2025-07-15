import React from 'react';
import { useUser } from '@/contexts/UserContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Plus, MessageSquare, Calendar, FileText } from 'lucide-react';

export default function Patients() {
  const { currentUser } = useUser();

  const mockPatients = [
    {
      id: 1,
      name: 'John Doe',
      age: 34,
      email: 'john.doe@email.com',
      phone: '+1 (555) 123-4567',
      lastVisit: '2024-01-15',
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
    },
    {
      id: 2,
      name: 'Sarah Wilson',
      age: 28,
      email: 'sarah.wilson@email.com',
      phone: '+1 (555) 234-5678',
      lastVisit: '2024-01-10',
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=32&h=32&fit=crop&crop=face'
    },
    {
      id: 3,
      name: 'Robert Brown',
      age: 45,
      email: 'robert.brown@email.com',
      phone: '+1 (555) 345-6789',
      lastVisit: '2024-01-08',
      status: 'Follow-up Required',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face'
    }
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Patients</h1>
          <p className="text-muted-foreground">
            Manage patient records and consultations.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Patient
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Patient Registry
          </CardTitle>
          <CardDescription>
            View and manage your patient database
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockPatients.map((patient) => (
              <div key={patient.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={patient.avatar} />
                    <AvatarFallback>
                      {patient.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">{patient.name}</h3>
                      <Badge variant={patient.status === 'Active' ? 'default' : 'secondary'}>
                        {patient.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Age: {patient.age} • Last visit: {patient.lastVisit}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {patient.email} • {patient.phone}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Message
                  </Button>
                  <Button variant="outline" size="sm">
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule
                  </Button>
                  <Button variant="outline" size="sm">
                    <FileText className="mr-2 h-4 w-4" />
                    Records
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}