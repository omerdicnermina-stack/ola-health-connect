import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AIAssessment from '@/components/AIAssessment';
import InstantVisitFlow from '@/components/InstantVisitFlow';
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
  Eye,
  Shield
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
      lastVisit: '2024-11-20',
      tags: []
    },
    {
      id: 2,
      name: 'Kai Nakamura',
      relationship: 'Son',
      age: 8,
      lastVisit: '2024-12-01',
      tags: ['Athlete', 'Jiu Jitsu']
    },
    {
      id: 3,
      name: 'Makoa Nakamura',
      relationship: 'Son',
      age: 6,
      lastVisit: '2024-11-15',
      tags: []
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
          <div className="flex-1">
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
            {user?.profile?.tags && user.profile.tags.length > 0 && (
              <div className="flex items-center gap-2 mt-3">
                <span className="text-sm font-medium text-blue-700">Your Profile:</span>
                <div className="flex gap-2 flex-wrap">
                  {user.profile.tags.map((tag, index) => (
                    <Badge 
                      key={index} 
                      className={`${
                        tag === 'Veteran' 
                          ? 'bg-amber-100 text-amber-800 border border-amber-300' 
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {tag === 'Veteran' && '🎖️'} 
                      {tag === 'Frequent Traveler' && '✈️'} 
                      {tag === 'Wellness Program' && '🌿'} 
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Emergency Notice */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <Phone className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <h3 className="font-semibold text-red-800">Medical Emergency</h3>
            <p className="text-sm text-red-700">
              If you are experiencing a medical emergency, <strong>call 911 immediately</strong> or go to your nearest emergency room.
            </p>
          </div>
        </div>
      </div>

      {/* Instant Visit - Primary Action */}
      <div className="max-w-2xl mx-auto mb-6">
        <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-teal-50 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6 text-center">
            <div className="relative mb-4">
              <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center shadow-lg">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
              {user?.profile?.tags?.includes('Veteran') && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center">
                  <Shield className="h-4 w-4 text-amber-600" />
                </div>
              )}
            </div>
            
            <h2 className="text-xl font-bold text-blue-900 mb-2">Start Instant Visit</h2>
            <p className="text-blue-700 mb-4">
              Get immediate care from our healthcare professionals
            </p>
            
            {user?.profile?.tags?.includes('Veteran') && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Shield className="h-4 w-4 text-amber-600" />
                  <span className="font-semibold text-amber-800 text-sm">Veteran Priority Access</span>
                </div>
                <p className="text-xs text-amber-700">
                  You'll be matched with providers who understand military experience
                </p>
              </div>
            )}
            
            <div className="flex gap-3 justify-center">
              <InstantVisitFlow />
              <Button size="sm" variant="outline" className="px-6 py-3">
                Schedule a Visit
              </Button>
              <AIAssessment 
                trigger={
                  <Button size="sm" variant="outline" className="px-6 py-3">
                    AI Health Assessment
                  </Button>
                }
              />
            </div>
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
                  Order Refill
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
                    {member.tags.length > 0 && (
                      <div className="flex gap-1 mt-1">
                        {member.tags.map((tag, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
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