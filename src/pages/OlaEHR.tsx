import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Patients from './Patients';
import Prescriptions from './Prescriptions';

export default function OlaEHR() {
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Ola EHR/EMR System</h1>
        <p className="text-muted-foreground">
          Comprehensive electronic health and medical records management.
        </p>
      </div>

      <Tabs defaultValue="patients" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="patients">Patients</TabsTrigger>
          <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="patients">
          <Patients />
        </TabsContent>
        
        <TabsContent value="prescriptions">
          <Prescriptions />
        </TabsContent>
      </Tabs>
    </div>
  );
}