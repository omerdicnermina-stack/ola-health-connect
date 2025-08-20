import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Plus, Video, FileText, Clock, BarChart3, Users, TrendingUp } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function Visits() {
  const { user } = useAuth();
  const isHRManager = user?.profile?.role === 'HR Manager';

  const mockVisits = [
    {
      id: 1,
      patient: 'John Doe',
      provider: 'Dr. Sarah Johnson',
      date: '2024-01-15',
      time: '14:30',
      duration: '25 min',
      type: 'General Consultation',
      status: 'Completed',
      notes: 'Patient reported mild headaches. Prescribed rest and hydration.',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
    },
    {
      id: 2,
      patient: 'Sarah Wilson',
      provider: 'Dr. Mike Chen',
      date: '2024-01-15',
      time: '15:00',
      duration: '18 min',
      type: 'Prescription Refill',
      status: 'Completed',
      notes: 'Refilled Lisinopril prescription. Patient doing well.',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=32&h=32&fit=crop&crop=face'
    },
    {
      id: 3,
      patient: 'Robert Brown',
      provider: 'Dr. Sarah Johnson',
      date: '2024-01-15',
      time: '16:30',
      duration: '—',
      type: 'Follow-up',
      status: 'Scheduled',
      notes: 'Follow-up for previous consultation',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face'
    },
    {
      id: 4,
      patient: 'Emily Davis',
      provider: 'Dr. Lisa Anderson',
      date: '2024-01-15',
      time: '17:00',
      duration: '32 min',
      type: 'Mental Health',
      status: 'In Progress',
      notes: 'Ongoing session...',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face'
    }
  ];

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'default';
      case 'In Progress':
        return 'secondary';
      case 'Scheduled':
        return 'outline';
      case 'Cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const visitStats = {
    total: mockVisits.length,
    completed: mockVisits.filter(v => v.status === 'Completed').length,
    inProgress: mockVisits.filter(v => v.status === 'In Progress').length,
    scheduled: mockVisits.filter(v => v.status === 'Scheduled').length,
    averageDuration: '23 min',
    types: {
      'General Consultation': 1,
      'Prescription Refill': 1,
      'Follow-up': 1,
      'Mental Health': 1
    }
  };

  if (isHRManager) {
    return (
      <div className="animate-fade-in">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Visit Statistics</h1>
          <p className="text-muted-foreground">
            Healthcare utilization analytics and trends.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{visitStats.total}</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Visits</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{visitStats.completed}</div>
              <p className="text-xs text-muted-foreground">
                {((visitStats.completed / visitStats.total) * 100).toFixed(0)}% completion rate
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{visitStats.inProgress}</div>
              <p className="text-xs text-muted-foreground">
                Currently in progress
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{visitStats.averageDuration}</div>
              <p className="text-xs text-muted-foreground">
                -2 min from last month
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Visit Status Distribution</CardTitle>
              <CardDescription>Current status breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="default">Completed</Badge>
                  </div>
                  <span className="font-medium">{visitStats.completed}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">In Progress</Badge>
                  </div>
                  <span className="font-medium">{visitStats.inProgress}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Scheduled</Badge>
                  </div>
                  <span className="font-medium">{visitStats.scheduled}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Visit Types</CardTitle>
              <CardDescription>Consultation categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(visitStats.types).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <span className="text-sm">{type}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Visits</h1>
          <p className="text-muted-foreground">
            View and manage patient consultations and appointments.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Schedule Visit
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Recent Visits
          </CardTitle>
          <CardDescription>
            Patient consultations and appointment history
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockVisits.map((visit) => (
              <div key={visit.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={visit.avatar} />
                    <AvatarFallback>
                      {visit.patient.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">{visit.patient}</h3>
                      <Badge variant={getStatusVariant(visit.status)}>
                        {visit.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {visit.type} with {visit.provider}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {visit.date} at {visit.time}
                      </span>
                      {visit.duration !== '—' && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {visit.duration}
                        </span>
                      )}
                    </div>
                    {visit.notes && (
                      <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded text-left max-w-md">
                        {visit.notes}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {visit.status === 'In Progress' && (
                    <Button variant="default" size="sm">
                      <Video className="mr-2 h-4 w-4" />
                      Join Call
                    </Button>
                  )}
                  {visit.status === 'Scheduled' && (
                    <Button variant="outline" size="sm">
                      <Video className="mr-2 h-4 w-4" />
                      Start Call
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    <FileText className="mr-2 h-4 w-4" />
                    Notes
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