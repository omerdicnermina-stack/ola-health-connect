import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
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
  Info,
  Scale,
  PenTool,
  CheckCircle,
  Baby
} from 'lucide-react';

interface HouseholdMemberDetailsProps {
  member: {
    id: number;
    name: string;
    relationship: string;
    age: number;
    gender: string;
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
  const [showPOADialog, setShowPOADialog] = useState(false);
  const [poaConsent, setPOAConsent] = useState({
    medicalDecisions: false,
    emergencyAuthorization: false,
    informationAccess: false,
    prescriptionManagement: false,
    appointmentScheduling: false,
    acknowledgment: false,
    signature: ''
  });
  const [poaAssigned, setPOAAssigned] = useState(false);

  const canAssignPOA = member.relationship === 'Spouse' && !member.isMinor;
  const minorsInFamily = [
    { name: 'Kai Nakamura', age: 8 },
    { name: 'Makoa Nakamura', age: 5 }
  ];

  const handlePOASubmit = () => {
    if (Object.values(poaConsent).every(value => value === true || value !== '')) {
      setPOAAssigned(true);
      setShowPOADialog(false);
      // In real app, this would save to database
    }
  };

  const isFormValid = poaConsent.medicalDecisions && 
                     poaConsent.emergencyAuthorization && 
                     poaConsent.informationAccess && 
                     poaConsent.prescriptionManagement && 
                     poaConsent.appointmentScheduling && 
                     poaConsent.acknowledgment && 
                     poaConsent.signature.trim() !== '';

  return (
    <>
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
                  {poaAssigned && canAssignPOA && (
                    <Scale className="h-4 w-4 text-green-600" />
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
            {/* POA Assignment Section */}
            {canAssignPOA && (
              <Card className={`${poaAssigned ? 'border-green-200 bg-green-50' : 'border-blue-200 bg-blue-50'}`}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Scale className={`h-5 w-5 ${poaAssigned ? 'text-green-600' : 'text-blue-600'}`} />
                    Power of Attorney for Minors
                  </CardTitle>
                  <CardDescription>
                    Authorize this family member to make medical decisions for minor children
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {poaAssigned ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-green-700">
                        <CheckCircle className="h-5 w-5" />
                        <span className="font-semibold">POA Assignment Active</span>
                      </div>
                      <p className="text-sm text-green-700">
                        {member.name} is authorized to make medical decisions for minor family members.
                      </p>
                      <div className="bg-white p-3 rounded border">
                        <p className="text-xs font-medium mb-2">Authorized for:</p>
                        <div className="space-y-1">
                          {minorsInFamily.map((minor, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <Baby className="h-4 w-4 text-blue-500" />
                              <span>{minor.name} (Age {minor.age})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => setShowPOADialog(true)}
                      >
                        View POA Details
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm text-blue-700">
                        Assign Power of Attorney to authorize {member.name} to make medical decisions 
                        for minor children in your family.
                      </p>
                      <div className="bg-white p-3 rounded border">
                        <p className="text-xs font-medium mb-2">Will be authorized for:</p>
                        <div className="space-y-1">
                          {minorsInFamily.map((minor, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <Baby className="h-4 w-4 text-blue-500" />
                              <span>{minor.name} (Age {minor.age})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => setShowPOADialog(true)}
                        className="w-full"
                      >
                        <Scale className="h-4 w-4 mr-2" />
                        Assign Power of Attorney
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

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
                    <p className="text-sm font-medium text-muted-foreground">Gender</p>
                    <p className="text-sm">{member.gender}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Blood Type</p>
                    <div className="flex items-center gap-2">
                      <Droplet className="h-4 w-4 text-red-500" />
                      <p className="text-sm">{member.bloodType}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Insurance</p>
                    <p className="text-sm">{member.insurance}</p>
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
                  {member.medicalConditions.length > 0 ? (
                    <div className="flex gap-2 flex-wrap">
                      {member.medicalConditions.map((condition, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {condition}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No known medical conditions</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Visit History */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Visit History
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Last Visit</p>
                  <p className="text-sm">{member.lastVisit}</p>
                </div>
                
                {member.nextAppointment && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Next Appointment</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      <p className="text-sm">{member.nextAppointment}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Emergency Contact Status */}
            {member.emergencyContact && (
              <Card className="border-amber-200 bg-amber-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-amber-600" />
                    <span className="font-semibold text-amber-800">Emergency Contact</span>
                  </div>
                  <p className="text-sm text-amber-700 mt-1">
                    This person is designated as an emergency contact for the family.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* POA Assignment Dialog */}
      <Dialog open={showPOADialog} onOpenChange={setShowPOADialog}>
        <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5" />
              Power of Attorney Assignment
            </DialogTitle>
            <DialogDescription>
              Legal authorization for medical decision-making for minor children
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <div className="flex items-center gap-2 mb-2">
                <Info className="h-5 w-5 text-amber-600" />
                <span className="font-semibold text-amber-800">Important Legal Document</span>
              </div>
              <p className="text-sm text-amber-700">
                This Power of Attorney grants {member.name} the legal authority to make medical 
                decisions for minor children in your family. Please read and understand all terms before signing.
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Authorization Scope</CardTitle>
                <CardDescription>
                  Select the medical authorities you wish to grant to {member.name}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Checkbox 
                      id="medical"
                      checked={poaConsent.medicalDecisions}
                      onCheckedChange={(checked) => 
                        setPOAConsent(prev => ({ ...prev, medicalDecisions: !!checked }))
                      }
                    />
                    <div className="space-y-1">
                      <label htmlFor="medical" className="text-sm font-medium cursor-pointer">
                        Medical Treatment Decisions
                      </label>
                      <p className="text-xs text-muted-foreground">
                        Authority to consent to medical treatments, procedures, and medications for minor children
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox 
                      id="emergency"
                      checked={poaConsent.emergencyAuthorization}
                      onCheckedChange={(checked) => 
                        setPOAConsent(prev => ({ ...prev, emergencyAuthorization: !!checked }))
                      }
                    />
                    <div className="space-y-1">
                      <label htmlFor="emergency" className="text-sm font-medium cursor-pointer">
                        Emergency Medical Authorization
                      </label>
                      <p className="text-xs text-muted-foreground">
                        Authority to make urgent medical decisions in emergency situations
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox 
                      id="information"
                      checked={poaConsent.informationAccess}
                      onCheckedChange={(checked) => 
                        setPOAConsent(prev => ({ ...prev, informationAccess: !!checked }))
                      }
                    />
                    <div className="space-y-1">
                      <label htmlFor="information" className="text-sm font-medium cursor-pointer">
                        Medical Information Access
                      </label>
                      <p className="text-xs text-muted-foreground">
                        Access to medical records, test results, and health information
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox 
                      id="prescriptions"
                      checked={poaConsent.prescriptionManagement}
                      onCheckedChange={(checked) => 
                        setPOAConsent(prev => ({ ...prev, prescriptionManagement: !!checked }))
                      }
                    />
                    <div className="space-y-1">
                      <label htmlFor="prescriptions" className="text-sm font-medium cursor-pointer">
                        Prescription Management
                      </label>
                      <p className="text-xs text-muted-foreground">
                        Authority to pick up prescriptions and manage medication schedules
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox 
                      id="appointments"
                      checked={poaConsent.appointmentScheduling}
                      onCheckedChange={(checked) => 
                        setPOAConsent(prev => ({ ...prev, appointmentScheduling: !!checked }))
                      }
                    />
                    <div className="space-y-1">
                      <label htmlFor="appointments" className="text-sm font-medium cursor-pointer">
                        Appointment Scheduling
                      </label>
                      <p className="text-xs text-muted-foreground">
                        Authority to schedule, modify, and cancel medical appointments
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Minor Children Covered</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {minorsInFamily.map((minor, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <Baby className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">{minor.name}</p>
                        <p className="text-sm text-muted-foreground">Age {minor.age}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Digital Signature */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <PenTool className="h-5 w-5" />
                  Digital Consent & Signature
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Checkbox 
                    id="acknowledgment"
                    checked={poaConsent.acknowledgment}
                    onCheckedChange={(checked) => 
                      setPOAConsent(prev => ({ ...prev, acknowledgment: !!checked }))
                    }
                  />
                  <div className="space-y-1">
                    <label htmlFor="acknowledgment" className="text-sm font-medium cursor-pointer">
                      Legal Acknowledgment
                    </label>
                    <p className="text-xs text-muted-foreground">
                      I acknowledge that I have read, understood, and agree to grant the above medical 
                      authorities to {member.name} for the care of minor children in my family. This 
                      Power of Attorney is effective immediately and remains valid until revoked in writing.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Digital Signature *</label>
                  <input
                    type="text"
                    placeholder="Type your full legal name as digital signature"
                    className="w-full p-3 border rounded-md"
                    value={poaConsent.signature}
                    onChange={(e) => 
                      setPOAConsent(prev => ({ ...prev, signature: e.target.value }))
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    By typing your name, you are providing a legally binding digital signature
                  </p>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600">
                    <strong>Date & Time:</strong> {new Date().toLocaleString()}<br/>
                    <strong>IP Address:</strong> [Recorded for legal purposes]<br/>
                    <strong>Document ID:</strong> POA-{Date.now()}
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowPOADialog(false)} className="flex-1">
                Cancel
              </Button>
              <Button 
                onClick={handlePOASubmit} 
                disabled={!isFormValid}
                className="flex-1"
              >
                <PenTool className="h-4 w-4 mr-2" />
                Execute Power of Attorney
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
