import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  Pill, 
  Users, 
  Heart,
  MapPin,
  Star,
  Phone,
  Video,
  Plus,
  Eye
} from 'lucide-react';

export default function PatientDashboard() {
  const { user } = useAuth();

  const upcomingVisits = [
    {
      id: 1,
      type: 'Routine Checkup',
      provider: 'Dr. Sarah Johnson',
      date: '2024-12-30',
      time: '2:00 PM',
      modality: 'video',
      location: 'Hilton Hawaiian Village - Waikiki Beach, Honolulu, HI'
    },
    {
      id: 2,
      type: 'Follow-up',
      provider: 'Dr. Michael Brown',
      date: '2025-01-05',
      time: '10:30 AM',
      modality: 'in-person',
      location: 'Hilton Hawaiian Village - Medical Center, Honolulu, HI'
    }
  ];

  const recentPrescriptions = [
    {
      id: 1,
      medication: 'Ibuprofen 400mg',
      prescriber: 'Dr. Sarah Johnson',
      date: '2024-12-15',
      quantity: '30 tablets',
      refills: 2,
      status: 'Ready for pickup'
    },
    {
      id: 2,
      medication: 'Vitamin D3 2000IU',
      prescriber: 'Dr. Michael Brown',
      date: '2024-12-10',
      quantity: '90 capsules',
      refills: 3,
      status: 'Delivered'
    }
  ];

  const householdMembers = [
    {
      id: 1,
      name: 'Leilani Nakamura',
      relationship: 'Spouse',
      age: 28,
      lastVisit: '2024-11-20'
    },
    {
      id: 2,
      name: 'Kai Nakamura',
      relationship: 'Child',
      age: 8,
      lastVisit: '2024-12-01'
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

  return (
    <div className="animate-fade-in space-y-6">
      {/* Hawaiian Greeting */}
      <div className="relative p-6 rounded-lg bg-gradient-to-r from-blue-50 to-teal-50 border border-blue-100">
        <div className="flex items-center gap-4">
          <div className="text-6xl">🌺</div>
          <div>
            <h1 className="text-3xl font-bold text-blue-900">
              Ola, {user?.profile?.name}!
            </h1>
            <p className="text-lg text-blue-700">
              Welcome to your health journey at Hilton Hawaiian Village
            </p>
            <div className="flex items-center gap-2 mt-2 text-sm text-blue-600">
              <MapPin className="h-4 w-4" />
              <span>Hilton Hawaiian Village - Waikiki Beach, Honolulu, HI</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 mx-auto mb-2 text-red-500" />
            <h3 className="font-semibold">Instant Visit</h3>
            <p className="text-sm text-muted-foreground mb-3">Get care now</p>
            <Button size="sm" className="w-full">Start Now</Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4 text-center">
            <Calendar className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <h3 className="font-semibold">Schedule Visit</h3>
            <p className="text-sm text-muted-foreground mb-3">Book future appointment</p>
            <Button size="sm" variant="outline" className="w-full">Schedule</Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4 text-center">
            <Pill className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <h3 className="font-semibold">Prescriptions</h3>
            <p className="text-sm text-muted-foreground mb-3">View & order</p>
            <Button size="sm" variant="outline" className="w-full">View All</Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 mx-auto mb-2 text-purple-500" />
            <h3 className="font-semibold">Family Care</h3>
            <p className="text-sm text-muted-foreground mb-3">Manage household</p>
            <Button size="sm" variant="outline" className="w-full">Manage</Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
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
              <div key={visit.id} className="border rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{visit.type}</h4>
                    <p className="text-sm text-muted-foreground">with {visit.provider}</p>
                  </div>
                  <Badge className={getModalityColor(visit.modality)}>
                    <div className="flex items-center gap-1">
                      {getModalityIcon(visit.modality)}
                      <span className="capitalize">{visit.modality}</span>
                    </div>
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{visit.date} at {visit.time}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="h-4 w-4" />
                    <span className="text-xs">{visit.location}</span>
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline">Reschedule</Button>
                  <Button size="sm" variant="outline">Cancel</Button>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              <Eye className="h-4 w-4 mr-2" />
              View All Visits
            </Button>
          </CardContent>
        </Card>

        {/* Recent Prescriptions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pill className="h-5 w-5" />
              Recent Prescriptions
            </CardTitle>
            <CardDescription>Your medications and refills</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentPrescriptions.map((prescription) => (
              <div key={prescription.id} className="border rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{prescription.medication}</h4>
                    <p className="text-sm text-muted-foreground">Prescribed by {prescription.prescriber}</p>
                  </div>
                  <Badge variant={prescription.status === 'Delivered' ? 'default' : 'secondary'}>
                    {prescription.status}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  <div>Quantity: {prescription.quantity}</div>
                  <div>Refills remaining: {prescription.refills}</div>
                  <div>Date: {prescription.date}</div>
                </div>
                <Button size="sm" variant="outline" className="w-full">
                  Order Refill to Hotel Room
                </Button>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              <Eye className="h-4 w-4 mr-2" />
              View All Prescriptions
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Household Members */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Household Members
              </CardTitle>
              <CardDescription>Manage care for your family</CardDescription>
            </div>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Member
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {householdMembers.map((member) => (
              <div key={member.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Heart className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{member.name}</h4>
                    <p className="text-sm text-muted-foreground">{member.relationship}, {member.age} years</p>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  Last visit: {member.lastVisit}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">Schedule</Button>
                  <Button size="sm" variant="outline" className="flex-1">View Records</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}