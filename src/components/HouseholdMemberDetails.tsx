import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  User, 
  Heart, 
  Phone, 
  Mail, 
  Calendar, 
  Shield,
  Droplet,
  FileText,
  MapPin,
  Clock,
  AlertCircle,
  Info
} from 'lucide-react';

interface HouseholdMemberDetailsProps {
  member: {
    id: number;
    name: string;
    relationship: string;
    age: number;
    dateOfBirth: string;
    email?: string | null;
    phone?: string | null;
    lastVisit: string;
    nextAppointment?: string | null;
    isMinor: boolean;
    emergencyContact: boolean;
    avatar: string;
    medicalConditions: string[];
    insurance: string;
    bloodType: string;
    tags: string[];
  };
}

export default function HouseholdMemberDetails({ member }: HouseholdMemberDetailsProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="flex-1">
          <User className="h-4 w-4 mr-1" />
          View Details
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
              {member.avatar}
            </div>
            <div>
              <div className="flex items-center gap-2">
                {member.name}
                {member.emergencyContact && (
                  <Shield className="h-4 w-4 text-amber-600" />
                )}
              </div>
              <p className="text-sm text-muted-foreground font-normal">
                {member.relationship} • {member.age} years old
              </p>
            </div>
          </DialogTitle>
          <DialogDescription>
            Complete health profile and family member details
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Date of Birth</p>
                  <p className="text-sm">{member.dateOfBirth}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Blood Type</p>
                  <div className="flex items-center gap-2">
                    <Droplet className="h-4 w-4 text-red-500" />
                    <p className="text-sm">{member.bloodType}</p>
                  </div>
                </div>
              </div>
              
              {member.email && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">{member.email}</p>
                  </div>
                </div>
              )}
              
              {member.phone && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Phone</p>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">{member.phone}</p>
                  </div>
                </div>
              )}

              <div>
                <p className="text-sm font-medium text-muted-foreground">Insurance</p>
                <p className="text-sm">{member.insurance}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Profile Tags</p>
                <div className="flex gap-2 flex-wrap">
                  {member.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Medical Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Medical Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Medical Conditions</p>
                <div className="space-y-2">
                  {member.medicalConditions.map((condition, index) => (
                    <div key={index} className="flex items-center gap-2">
                      {condition === 'None' ? (
                        <div className="flex items-center gap-2 text-green-600">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm">No known medical conditions</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-amber-500" />
                          <span className="text-sm">{condition}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Visit History */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Visit History
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Last Visit</p>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">{member.lastVisit}</p>
                  </div>
                </div>
                
                {member.nextAppointment ? (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Next Appointment</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      <p className="text-sm text-blue-600 font-medium">{member.nextAppointment}</p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Next Appointment</p>
                    <p className="text-sm text-muted-foreground">None scheduled</p>
                  </div>
                )}
              </div>

              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Location</span>
                </div>
                <p className="text-xs text-blue-700">
                  Hilton Hawaiian Village - Medical Center, Honolulu, HI
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Special Notes for Minors */}
          {member.isMinor && (
            <Card className="border-amber-200 bg-amber-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="h-5 w-5 text-amber-600" />
                  <span className="font-medium text-amber-800">Minor Patient</span>
                </div>
                <p className="text-sm text-amber-700">
                  As a minor, all medical decisions require parental/guardian consent. 
                  Emergency contact information is automatically linked to the primary account holder.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Emergency Contact Badge */}
          {member.emergencyContact && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-5 w-5 text-red-600" />
                  <span className="font-medium text-red-800">Emergency Contact</span>
                </div>
                <p className="text-sm text-red-700">
                  This family member is designated as an emergency contact and can make 
                  medical decisions on your behalf if needed.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button className="flex-1">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Appointment
            </Button>
            <Button variant="outline" className="flex-1">
              <FileText className="h-4 w-4 mr-2" />
              View Medical Records
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}