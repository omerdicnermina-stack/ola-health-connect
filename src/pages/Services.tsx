import React from 'react';
import { useUser } from '@/contexts/UserContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Stethoscope, Plus, Edit, Trash2, Users } from 'lucide-react';

export default function Services() {
  const { hasPermission } = useUser();
  const canManage = hasPermission('manage_services');

  const mockServices = [
    {
      id: 1,
      name: 'General Consultation',
      description: 'Basic medical consultation for common health concerns',
      duration: '15-30 minutes',
      price: '$75',
      providers: 12,
      status: 'Active'
    },
    {
      id: 2,
      name: 'Mental Health Counseling',
      description: 'Professional mental health support and counseling',
      duration: '45-60 minutes',
      price: '$120',
      providers: 8,
      status: 'Active'
    },
    {
      id: 3,
      name: 'Pediatric Care',
      description: 'Specialized care for children and adolescents',
      duration: '20-40 minutes',
      price: '$85',
      providers: 5,
      status: 'Active'
    },
    {
      id: 4,
      name: 'Dermatology Consultation',
      description: 'Skin condition assessment and treatment guidance',
      duration: '20-30 minutes',
      price: '$95',
      providers: 3,
      status: 'Limited'
    },
    {
      id: 5,
      name: 'Prescription Refill',
      description: 'Quick consultation for prescription renewals',
      duration: '10-15 minutes',
      price: '$45',
      providers: 15,
      status: 'Active'
    }
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Services</h1>
          <p className="text-muted-foreground">
            Manage available telemedicine services and specialties.
          </p>
        </div>
        {canManage && (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Service
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5" />
            Available Services
          </CardTitle>
          <CardDescription>
            Medical services offered through the telemedicine platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockServices.map((service) => (
              <Card key={service.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{service.name}</CardTitle>
                    <Badge variant={service.status === 'Active' ? 'default' : 'secondary'}>
                      {service.status}
                    </Badge>
                  </div>
                  <CardDescription className="text-sm">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="font-medium">{service.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Price:</span>
                      <span className="font-medium text-primary">{service.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Providers:</span>
                      <span className="font-medium flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {service.providers}
                      </span>
                    </div>
                  </div>
                  
                  {canManage && (
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="mr-2 h-3 w-3" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}