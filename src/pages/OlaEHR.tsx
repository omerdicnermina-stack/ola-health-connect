import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Unlock, Shield, UserCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Patients from './Patients';
import Prescriptions from './Prescriptions';
import Visits from './Visits';

export default function OlaEHR() {
  const { toast } = useToast();
  const [isUnlocked, setIsUnlocked] = useState(false);

  // Hardcoded credentials (pre-filled)
  const [credentials, setCredentials] = useState({
    providerId: 'DR001-2024',
    licenseNumber: 'MD-12345-CA',
    npiNumber: '1234567890'
  });

  const handleUnlock = () => {
    // Simulate credential verification
    if (credentials.providerId && credentials.licenseNumber && credentials.npiNumber) {
      setIsUnlocked(true);
      toast({
        title: "Access Granted",
        description: "Provider credentials verified. EHR/EMR system unlocked.",
      });
    }
  };

  const handleLock = () => {
    setIsUnlocked(false);
    toast({
      title: "System Locked",
      description: "EHR/EMR system has been secured.",
      variant: "default"
    });
  };

  if (!isUnlocked) {
    return (
      <div className="animate-fade-in">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Ola EHR/EMR System</h1>
          <p className="text-muted-foreground">
            Secure access to electronic health and medical records management.
          </p>
        </div>

        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="flex items-center justify-center gap-2">
                <Lock className="h-5 w-5" />
                Provider Verification Required
              </CardTitle>
              <CardDescription>
                Please verify your provider credentials to access the EHR/EMR system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="providerId">Provider ID</Label>
                <Input
                  id="providerId"
                  value={credentials.providerId}
                  onChange={(e) => setCredentials({...credentials, providerId: e.target.value})}
                  placeholder="Enter Provider ID"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="licenseNumber">Medical License Number</Label>
                <Input
                  id="licenseNumber"
                  value={credentials.licenseNumber}
                  onChange={(e) => setCredentials({...credentials, licenseNumber: e.target.value})}
                  placeholder="Enter License Number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="npiNumber">NPI Number</Label>
                <Input
                  id="npiNumber"
                  value={credentials.npiNumber}
                  onChange={(e) => setCredentials({...credentials, npiNumber: e.target.value})}
                  placeholder="Enter NPI Number"
                />
              </div>
              
              <div className="pt-4 space-y-3">
                <Button 
                  onClick={handleUnlock} 
                  className="w-full"
                  size="lg"
                >
                  <Unlock className="mr-2 h-4 w-4" />
                  Unlock EHR/EMR System
                </Button>
                
                <div className="text-center text-sm text-muted-foreground">
                  <UserCheck className="inline h-4 w-4 mr-1" />
                  Credentials are pre-verified for demo purposes
                </div>
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
          <h1 className="text-3xl font-bold tracking-tight">Ola EHR/EMR System</h1>
          <p className="text-muted-foreground">
            Comprehensive electronic health and medical records management.
          </p>
        </div>
        <Button variant="outline" onClick={handleLock}>
          <Lock className="mr-2 h-4 w-4" />
          Lock System
        </Button>
      </div>

      <Tabs defaultValue="patients" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="patients">Patients</TabsTrigger>
          <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
          <TabsTrigger value="visits">Visits</TabsTrigger>
        </TabsList>
        
        <TabsContent value="patients">
          <Patients />
        </TabsContent>
        
        <TabsContent value="prescriptions">
          <Prescriptions />
        </TabsContent>
        
        <TabsContent value="visits">
          <Visits />
        </TabsContent>
      </Tabs>
    </div>
  );
}