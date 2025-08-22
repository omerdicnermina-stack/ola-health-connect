import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  Video, 
  Phone, 
  MapPin,
  Star,
  Eye,
  Plus
} from 'lucide-react';

export default function PatientVisits() {
  const pastVisits = [
    {
      id: 1,
      type: 'Annual Checkup',
      provider: 'Dr. Sarah Johnson',
      date: '2024-12-15',
      time: '10:00 AM',
      modality: 'video',
      location: 'Hilton Hawaiian Village - Waikiki Beach, Honolulu, HI',
      status: 'Completed',
      rating: 5,
      notes: 'Great consultation, very helpful'
    },
    {
      id: 2,
      type: 'Follow-up',
      provider: 'Dr. Michael Brown',
      date: '2024-11-20',
      time: '2:30 PM',
      modality: 'in-person',
      location: 'Hilton Hawaiian Village - Medical Center, Honolulu, HI',
      status: 'Completed',
      rating: 4,
      notes: 'Thorough examination'
    },
    {
      id: 3,
      type: 'Urgent Care',
      provider: 'Dr. Emily Chen',
      date: '2024-10-05',
      time: '11:15 AM',
      modality: 'phone',
      location: 'Hilton Hawaiian Village - Waikiki Beach, Honolulu, HI',
      status: 'Completed',
      rating: 5,
      notes: 'Quick response for urgent issue'
    }
  ];

  const upcomingVisits = [
    {
      id: 1,
      type: 'Routine Checkup',
      provider: 'Dr. Sarah Johnson',
      date: '2024-12-30',
      time: '2:00 PM',
      modality: 'video',
      location: 'Hilton Hawaiian Village - Waikiki Beach, Honolulu, HI',
      status: 'Scheduled'
    },
    {
      id: 2,
      type: 'Follow-up',
      provider: 'Dr. Michael Brown',
      date: '2025-01-05',
      time: '10:30 AM',
      modality: 'in-person',
      location: 'Hilton Hawaiian Village - Medical Center, Honolulu, HI',
      status: 'Scheduled'
    }
  ];

  const getModalityIcon = (modality: string) => {
    switch (modality) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'phone': return <Phone className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  const getModalityColor = (modality: string) => {
    switch (modality) {
      case 'video': return 'bg-blue-100 text-blue-800';
      case 'phone': return 'bg-green-100 text-green-800';
      default: return 'bg-purple-100 text-purple-800';
    }
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Visits</h1>
          <p className="text-muted-foreground">View your past and upcoming appointments</p>
        </div>
        <div className="flex gap-2">
          <Button>
            <Clock className="h-4 w-4 mr-2" />
            Instant Visit
          </Button>
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Schedule Visit
          </Button>
        </div>
      </div>

      {/* Upcoming Visits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Upcoming Visits
          </CardTitle>
          <CardDescription>Your scheduled appointments</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {upcomingVisits.map((visit) => (
            <div key={visit.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-lg">{visit.type}</h4>
                  <p className="text-muted-foreground">with {visit.provider}</p>
                </div>
                <Badge className={getModalityColor(visit.modality)}>
                  <div className="flex items-center gap-1">
                    {getModalityIcon(visit.modality)}
                    <span className="capitalize">{visit.modality}</span>
                  </div>
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{visit.date} at {visit.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs">{visit.location}</span>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline">Join Visit</Button>
                <Button size="sm" variant="outline">Reschedule</Button>
                <Button size="sm" variant="outline">Cancel</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Past Visits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Past Visits
          </CardTitle>
          <CardDescription>Your completed appointments and visit history</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {pastVisits.map((visit) => (
            <div key={visit.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-lg">{visit.type}</h4>
                  <p className="text-muted-foreground">with {visit.provider}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getModalityColor(visit.modality)}>
                    <div className="flex items-center gap-1">
                      {getModalityIcon(visit.modality)}
                      <span className="capitalize">{visit.modality}</span>
                    </div>
                  </Badge>
                  <Badge variant="secondary">{visit.status}</Badge>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{visit.date} at {visit.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs">{visit.location}</span>
                </div>
              </div>
              
              {/* Rating and Notes */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Your Rating:</span>
                  {renderStars(visit.rating)}
                </div>
                {visit.notes && (
                  <div className="text-sm">
                    <span className="font-medium">Notes:</span>
                    <p className="text-muted-foreground italic">"{visit.notes}"</p>
                  </div>
                )}
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline">View Details</Button>
                <Button size="sm" variant="outline">Download Records</Button>
                <Button size="sm" variant="outline">Book Follow-up</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}