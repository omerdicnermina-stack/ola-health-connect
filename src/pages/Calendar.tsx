import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, User, MapPin, Video } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { format, isToday, isFuture } from 'date-fns';

// Mock future visits data with more diverse dates for demo
const futureVisits = [
  // Today's appointments
  {
    id: '1',
    patientName: 'John Smith',
    date: new Date(2024, 11, 22, 14, 30), // Today, 2:30 PM
    type: 'Video Consultation',
    duration: 30,
    location: 'Virtual',
    status: 'confirmed',
    reason: 'Follow-up consultation'
  },
  {
    id: '2',
    patientName: 'Sarah Johnson',
    date: new Date(2024, 11, 22, 16, 0), // Today, 4:00 PM
    type: 'Phone Consultation',
    duration: 15,
    location: 'Phone',
    status: 'confirmed',
    reason: 'Prescription review'
  },
  
  // Tomorrow's appointments
  {
    id: '3',
    patientName: 'Michael Brown',
    date: new Date(2024, 11, 23, 9, 0), // Tomorrow, 9:00 AM
    type: 'Video Consultation',
    duration: 45,
    location: 'Virtual',
    status: 'pending',
    reason: 'Initial consultation'
  },
  {
    id: '4',
    patientName: 'Emily Davis',
    date: new Date(2024, 11, 23, 11, 30), // Tomorrow, 11:30 AM
    type: 'Video Consultation',
    duration: 20,
    location: 'Virtual',
    status: 'confirmed',
    reason: 'Mental health check-in'
  },
  {
    id: '5',
    patientName: 'Robert Wilson',
    date: new Date(2024, 11, 23, 15, 0), // Tomorrow, 3:00 PM
    type: 'Phone Consultation',
    duration: 30,
    location: 'Phone',
    status: 'confirmed',
    reason: 'Lab results discussion'
  },

  // This week's appointments
  {
    id: '6',
    patientName: 'Lisa Anderson',
    date: new Date(2024, 11, 24, 10, 0), // Day after tomorrow, 10:00 AM
    type: 'Video Consultation',
    duration: 25,
    location: 'Virtual',
    status: 'confirmed',
    reason: 'Routine check-up'
  },
  {
    id: '7',
    patientName: 'David Miller',
    date: new Date(2024, 11, 25, 14, 0), // Dec 25, 2:00 PM
    type: 'Video Consultation',
    duration: 40,
    location: 'Virtual',
    status: 'pending',
    reason: 'Chronic condition management'
  },
  {
    id: '8',
    patientName: 'Jennifer Taylor',
    date: new Date(2024, 11, 26, 9, 30), // Dec 26, 9:30 AM
    type: 'Phone Consultation',
    duration: 20,
    location: 'Phone',
    status: 'confirmed',
    reason: 'Medication adjustment'
  },
  {
    id: '9',
    patientName: 'Christopher Lee',
    date: new Date(2024, 11, 26, 13, 30), // Dec 26, 1:30 PM
    type: 'Video Consultation',
    duration: 35,
    location: 'Virtual',
    status: 'confirmed',
    reason: 'Post-surgery follow-up'
  },

  // Next week's appointments
  {
    id: '10',
    patientName: 'Amanda Rodriguez',
    date: new Date(2024, 11, 30, 11, 0), // Dec 30, 11:00 AM
    type: 'Video Consultation',
    duration: 30,
    location: 'Virtual',
    status: 'confirmed',
    reason: 'Wellness consultation'
  },
  {
    id: '11',
    patientName: 'James Thompson',
    date: new Date(2025, 0, 2, 10, 30), // Jan 2, 2025, 10:30 AM
    type: 'Phone Consultation',
    duration: 15,
    location: 'Phone',
    status: 'pending',
    reason: 'Quick health check'
  },
  {
    id: '12',
    patientName: 'Maria Garcia',
    date: new Date(2025, 0, 3, 14, 15), // Jan 3, 2025, 2:15 PM
    type: 'Video Consultation',
    duration: 50,
    location: 'Virtual',
    status: 'confirmed',
    reason: 'Comprehensive health assessment'
  },
  {
    id: '13',
    patientName: 'Kevin White',
    date: new Date(2025, 0, 6, 16, 0), // Jan 6, 2025, 4:00 PM
    type: 'Video Consultation',
    duration: 25,
    location: 'Virtual',
    status: 'confirmed',
    reason: 'Dermatology consultation'
  },
  {
    id: '14',
    patientName: 'Rachel Green',
    date: new Date(2025, 0, 8, 9, 0), // Jan 8, 2025, 9:00 AM
    type: 'Phone Consultation',
    duration: 20,
    location: 'Phone',
    status: 'pending',
    reason: 'Allergy consultation'
  },
  {
    id: '15',
    patientName: 'Thomas Clark',
    date: new Date(2025, 0, 10, 15, 30), // Jan 10, 2025, 3:30 PM
    type: 'Video Consultation',
    duration: 35,
    location: 'Virtual',
    status: 'confirmed',
    reason: 'Cardiology follow-up'
  }
];

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  const getVisitsForDate = (date: Date) => {
    return futureVisits.filter(visit => 
      format(visit.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  const selectedDateVisits = selectedDate ? getVisitsForDate(selectedDate) : [];
  const upcomingVisits = futureVisits.filter(visit => isFuture(visit.date)).slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    if (type.includes('Video')) return <Video className="h-4 w-4" />;
    return <Clock className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Calendar</h1>
          <p className="text-muted-foreground">Manage your upcoming patient visits and appointments</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendar Component */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Select Date
            </CardTitle>
            <CardDescription>
              Choose a date to view scheduled visits
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              modifiers={{
                hasVisits: futureVisits.map(visit => visit.date)
              }}
              modifiersStyles={{
                hasVisits: { backgroundColor: 'hsl(var(--primary) / 0.1)', fontWeight: 'bold' }
              }}
            />
            <div className="mt-4 text-sm text-muted-foreground">
              <p>Dates with visits are highlighted</p>
            </div>
          </CardContent>
        </Card>

        {/* Selected Date Visits */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              {selectedDate ? (
                <>Visits for {format(selectedDate, 'EEEE, MMMM d, yyyy')}</>
              ) : (
                'Select a date to view visits'
              )}
            </CardTitle>
            <CardDescription>
              {selectedDateVisits.length} visit{selectedDateVisits.length !== 1 ? 's' : ''} scheduled
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedDateVisits.length > 0 ? (
              <div className="space-y-4">
                {selectedDateVisits.map((visit) => (
                  <div key={visit.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-3">
                      {getTypeIcon(visit.type)}
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {visit.patientName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {format(visit.date, 'h:mm a')} • {visit.duration} min • {visit.reason}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3" />
                          {visit.location}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(visit.status)}>
                        {visit.status}
                      </Badge>
                      <Button size="sm" variant="outline">
                        {visit.type.includes('Video') ? 'Join Call' : 'Start Call'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <CalendarIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No visits scheduled for this date</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Visits Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Visits</CardTitle>
          <CardDescription>Your next {upcomingVisits.length} scheduled appointments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upcomingVisits.map((visit) => (
              <div key={visit.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                <div className="flex items-center gap-3">
                  {getTypeIcon(visit.type)}
                  <div>
                    <div className="font-medium">{visit.patientName}</div>
                    <div className="text-sm text-muted-foreground">
                      {format(visit.date, 'MMM d, h:mm a')} • {visit.reason}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(visit.status)}>
                    {visit.status}
                  </Badge>
                  {isToday(visit.date) && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      Today
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarPage;