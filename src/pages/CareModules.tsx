import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Services from './Services';
import Plans from './Plans';
import Questionnaires from './Questionnaires';
import VisitTypes from './VisitTypes';

export default function CareModules() {
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Care Modules</h1>
        <p className="text-muted-foreground">
          Manage healthcare services, visit types, plans, and assessment questionnaires.
        </p>
      </div>

      <Tabs defaultValue="services" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="visit-types">Visit Types</TabsTrigger>
          <TabsTrigger value="plans">Plans</TabsTrigger>
          <TabsTrigger value="questionnaires">Questionnaires</TabsTrigger>
        </TabsList>
        
        <TabsContent value="services">
          <Services />
        </TabsContent>
        
        <TabsContent value="visit-types">
          <VisitTypes />
        </TabsContent>
        
        <TabsContent value="plans">
          <Plans />
        </TabsContent>
        
        <TabsContent value="questionnaires">
          <Questionnaires />
        </TabsContent>
      </Tabs>
    </div>
  );
}