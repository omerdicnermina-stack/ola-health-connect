import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import HouseholdMemberDetails from '@/components/HouseholdMemberDetails';
import { 
  Users, 
  Plus, 
  Heart, 
  Calendar, 
  Clock,
  MapPin,
  Video,
  Phone,
  UserPlus,
  Baby,
  Shield
} from 'lucide-react';

export default function Household() {
  const [showAddMember, setShowAddMember] = useState(false);

  const householdMembers = [
    {
      id: 1,
      name: 'Leilani Nakamura',
      relationship: 'Spouse',
      age: 28,
      gender: 'Female',
      dateOfBirth: '1996-03-15',
      email: 'leilani.nakamura@gmail.com',
      phone: '(808) 555-0123',
      lastVisit: '2024-11-20',
      nextAppointment: null,
      isMinor: false,
      emergencyContact: true,
      avatar: '👩🏽',
      medicalConditions: ['Seasonal Allergies'],
      insurance: 'Hilton Employee Health Plan',
      bloodType: 'A+',
      tags: ['Wellness Program', 'Preventive Care']
    },
    {
      id: 2,
      name: 'Kai Nakamura',
      relationship: 'Child',
      age: 8,
      gender: 'Male',
      dateOfBirth: '2016-07-22',
      email: null,
      phone: null,
      lastVisit: '2024-12-01',
      nextAppointment: '2024-12-28',
      isMinor: true,
      emergencyContact: false,
      avatar: '👦🏽',
      medicalConditions: ['Asthma'],
      insurance: 'Hilton Family Health Plan',
      bloodType: 'O+',
      tags: ['Pediatric Care', 'Asthma Management']
    },
    {
      id: 3,
      name: 'Makoa Nakamura',
      relationship: 'Child',
      age: 5,
      gender: 'Male',
      dateOfBirth: '2019-09-10',
      email: null,
      phone: null,
      lastVisit: '2024-11-15',
      nextAppointment: null,
      isMinor: true,
      emergencyContact: false,
      avatar: '👶🏽',
      medicalConditions: ['None'],
      insurance: 'Hilton Family Health Plan',
      bloodType: 'A+',
      tags: ['Pediatric Care', 'Well Child Visits']
    }
  ];

  const recentActivity = [
    {
      id: 1,
      memberName: 'Kai Nakamura',
      activity: 'Scheduled checkup appointment',
      date: '2024-12-20',
      type: 'appointment'
    },
    {
      id: 2,
      memberName: 'Leilani Nakamura',
      activity: 'Completed virtual consultation',
      date: '2024-11-20',
      type: 'visit'
    },
    {
      id: 3,
      memberName: 'Makoa Nakamura',
      activity: 'Prescription refill requested',
      date: '2024-11-15',
      type: 'prescription'
    }
  ];

  const handleAddMember = () => {
    setShowAddMember(false);
    // Add member logic here
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Household Members</h1>
          <p className="text-muted-foreground">Manage care for your family members</p>
        </div>
        <Dialog open={showAddMember} onOpenChange={setShowAddMember}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Family Member
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Family Member</DialogTitle>
              <DialogDescription>
                Add a family member to manage their healthcare through your account.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input id="name" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="relationship" className="text-right">
                  Relationship
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="spouse">Spouse</SelectItem>
                    <SelectItem value="child">Child</SelectItem>
                    <SelectItem value="parent">Parent</SelectItem>
                    <SelectItem value="sibling">Sibling</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dob" className="text-right">
                  Date of Birth
                </Label>
                <Input id="dob" type="date" className="col-span-3" />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddMember(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddMember}>Add Member</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Household Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <h3 className="font-semibold">Total Members</h3>
            <p className="text-2xl font-bold">{householdMembers.length + 1}</p>
            <p className="text-sm text-muted-foreground">Including you</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Baby className="h-8 w-8 mx-auto mb-2 text-purple-500" />
            <h3 className="font-semibold">Minors</h3>
            <p className="text-2xl font-bold">{householdMembers.filter(m => m.isMinor).length}</p>
            <p className="text-sm text-muted-foreground">Under 18 years</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <h3 className="font-semibold">Upcoming Visits</h3>
            <p className="text-2xl font-bold">{householdMembers.filter(m => m.nextAppointment).length}</p>
            <p className="text-sm text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Heart className="h-8 w-8 mx-auto mb-2 text-red-500" />
            <h3 className="font-semibold">Emergency Contacts</h3>
            <p className="text-2xl font-bold">{householdMembers.filter(m => m.emergencyContact).length}</p>
            <p className="text-sm text-muted-foreground">Authorized</p>
          </CardContent>
        </Card>
      </div>

      {/* Family Members */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Family Members
          </CardTitle>
          <CardDescription>Manage healthcare for your family</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {householdMembers.map((member) => (
              <div key={member.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                    {member.avatar}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{member.name}</h4>
                    <p className="text-sm text-muted-foreground">{member.relationship}</p>
                    <div className="flex gap-1 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {member.age} years old
                      </Badge>
                      {member.isMinor && (
                        <Badge variant="secondary" className="text-xs">Minor</Badge>
                      )}
                      {member.emergencyContact && (
                        <Badge className="text-xs bg-red-100 text-red-800">
                          <Shield className="h-3 w-3 mr-1" />
                          Emergency Contact
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {member.tags.map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Last visit: {member.lastVisit}</span>
                  </div>
                  {member.nextAppointment && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Next: {member.nextAppointment}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs">Hilton Hawaiian Village</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">
                      <Calendar className="h-4 w-4 mr-1" />
                      Schedule
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Video className="h-4 w-4 mr-1" />
                      Instant Visit
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      View Records
                    </Button>
                    <HouseholdMemberDetails member={member} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Family Activity
          </CardTitle>
          <CardDescription>Recent healthcare activities for your family members</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center gap-4 p-3 border rounded-lg">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  {activity.type === 'appointment' && <Calendar className="h-5 w-5 text-blue-600" />}
                  {activity.type === 'visit' && <Video className="h-5 w-5 text-green-600" />}
                  {activity.type === 'prescription' && <Heart className="h-5 w-5 text-purple-600" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{activity.memberName}</p>
                  <p className="text-sm text-muted-foreground">{activity.activity}</p>
                </div>
                <div className="text-sm text-muted-foreground">
                  {activity.date}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}