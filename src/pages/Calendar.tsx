import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, User, MapPin, Video, FileText, X, Phone, UserCheck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { format, isToday, isFuture } from 'date-fns';

// Patient's personal visits data (self and minor dependents only)
const patientVisits = [
  // Past appointments (completed)
  {
    id: 'past1',
    patientName: 'Current User',
    date: new Date(2025, 7, 15, 10, 0), // Aug 15, 10:00 AM
    type: 'Video Consultation',
    modality: 'Video Call',
    duration: 30,
    location: 'Virtual Visit',
    status: 'completed',
    reason: 'Mental health check-in',
    notes: 'Patient reports improved mood and better sleep patterns. Continue current therapy approach.'
  },
  {
    id: 'past2',
    patientName: 'Emma (daughter)',
    date: new Date(2025, 7, 18, 14, 30), // Aug 18, 2:30 PM
    type: 'Video Consultation',
    modality: 'Video Call',
    duration: 20,
    location: 'Virtual Visit',
    status: 'completed',
    reason: 'Routine pediatric checkup',
    notes: 'Child is developing normally. Updated vaccination schedule discussed with parent.'
  },
  {
    id: 'past3',
    patientName: 'Current User',
    date: new Date(2025, 7, 20, 16, 0), // Aug 20, 4:00 PM
    type: 'Phone Consultation',
    modality: 'Phone Call',
    duration: 15,
    location: 'Phone Call',
    status: 'completed',
    reason: 'Medication review',
    notes: 'Adjusted anxiety medication dosage. Patient tolerating well with minimal side effects.'
  },
  
  // Today's appointments
  {
    id: '1',
    patientName: 'Current User',
    date: new Date(2025, 7, 22, 14, 30), // Today, 2:30 PM
    type: 'Video Consultation',
    modality: 'Video Call',
    duration: 30,
    location: 'Virtual Visit',
    status: 'confirmed',
    reason: 'Follow-up mental health consultation'
  },
  
  // Future appointments
  {
    id: '2',
    patientName: 'Emma (daughter)',
    date: new Date(2025, 7, 25, 11, 0), // Aug 25, 11:00 AM
    type: 'Video Consultation',
    modality: 'Video Call',
    duration: 25,
    location: 'Virtual Visit',
    status: 'confirmed',
    reason: 'Pediatric wellness check'
  },
  {
    id: '3',
    patientName: 'Current User',
    date: new Date(2025, 7, 28, 9, 30), // Aug 28, 9:30 AM
    type: 'Video Consultation',
    modality: 'Video Call',
    duration: 45,
    location: 'Virtual Visit',
    status: 'confirmed',
    reason: 'Therapy session'
  },
  {
    id: '4',
    patientName: 'Max (son)',
    date: new Date(2025, 7, 30, 15, 0), // Aug 30, 3:00 PM
    type: 'Video Consultation',
    modality: 'Video Call',
    duration: 20,
    location: 'Virtual Visit',
    status: 'pending',
    reason: 'ADHD follow-up consultation'
  }
];

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedVisit, setSelectedVisit] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const getVisitsForDate = (date: Date) => {
    return patientVisits.filter(visit => 
      format(visit.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  const selectedDateVisits = selectedDate ? getVisitsForDate(selectedDate) : [];
  const upcomingVisits = patientVisits.filter(visit => isFuture(visit.date)).slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (modality: string) => {
    switch (modality) {
      case 'Video Call': return <Video className="h-4 w-4" />;
      case 'Phone Call': return <Phone className="h-4 w-4" />;
      case 'In-Person': return <UserCheck className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const handleVisitClick = (visit: any) => {
    if (visit.status === 'completed') {
      setSelectedVisit(visit);
      setIsDialogOpen(true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Calendar</h1>
          <p className="text-muted-foreground">View your visits and appointments for yourself and family members</p>
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
                hasVisits: patientVisits.map(visit => visit.date)
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
                  <div 
                    key={visit.id} 
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                    onClick={() => handleVisitClick(visit)}
                  >
                    <div className="flex items-center gap-3">
                      {getTypeIcon(visit.modality)}
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
                          {visit.location} • {visit.modality}
                        </div>
                        {visit.notes && (
                          <div className="text-xs text-muted-foreground mt-1 italic">
                            "{visit.notes.substring(0, 80)}{visit.notes.length > 80 ? '...' : ''}"
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(visit.status)}>
                        {visit.status}
                      </Badge>
                      {visit.status === 'completed' ? (
                        <Button size="sm" variant="outline" onClick={(e) => {
                          e.stopPropagation();
                          handleVisitClick(visit);
                        }}>
                          View Details
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline">
                          {visit.modality === 'Video Call' ? 'Join Call' : visit.modality === 'Phone Call' ? 'Start Call' : 'View Location'}
                        </Button>
                      )}
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
                {getTypeIcon(visit.modality)}
                <div>
                  <div className="font-medium">{visit.patientName}</div>
                  <div className="text-sm text-muted-foreground">
                    {format(visit.date, 'MMM d, h:mm a')} • {visit.reason}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {visit.location} • {visit.modality}
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

      {/* Visit Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Visit Details
            </DialogTitle>
            <DialogDescription>
              Complete consultation summary and notes
            </DialogDescription>
          </DialogHeader>
          
          {selectedVisit && (
            <div className="space-y-6">
              {/* Patient & Visit Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Patient</label>
                  <div className="text-lg font-semibold flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {selectedVisit.patientName}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Date & Time</label>
                  <div className="text-lg font-semibold flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    {format(selectedVisit.date, 'EEEE, MMMM d, yyyy')}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {format(selectedVisit.date, 'h:mm a')} ({selectedVisit.duration} minutes)
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Visit Modality</label>
                  <div className="flex items-center gap-2 mt-1">
                    {getTypeIcon(selectedVisit.modality)}
                    <span>{selectedVisit.modality}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Patient Location</label>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="h-4 w-4" />
                    <span>{selectedVisit.location}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Reason for Visit</label>
                <div className="mt-1 p-3 bg-muted rounded-lg">
                  {selectedVisit.reason}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Clinical Notes</label>
                <div className="mt-1 p-4 bg-muted rounded-lg">
                  <p className="text-sm leading-relaxed">
                    {selectedVisit.notes || 'No clinical notes available for this visit.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <Badge className={getStatusColor(selectedVisit.status)} variant="outline">
                  {selectedVisit.status.toUpperCase()}
                </Badge>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CalendarPage;