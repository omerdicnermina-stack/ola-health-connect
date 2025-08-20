import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pill, Plus, Eye, Edit } from 'lucide-react';

export default function Prescriptions() {
  const { user, hasPermission } = useAuth();
  const canEdit = hasPermission('edit_prescriptions');

  const mockPrescriptions = [
    {
      id: 1,
      patient: 'John Doe',
      medication: 'Amoxicillin 500mg',
      dosage: '3x daily for 7 days',
      prescriber: 'Dr. Sarah Johnson',
      date: '2024-01-15',
      status: 'Active'
    },
    {
      id: 2,
      patient: 'Sarah Wilson',
      medication: 'Lisinopril 10mg',
      dosage: '1x daily',
      prescriber: 'Dr. Mike Chen',
      date: '2024-01-14',
      status: 'Filled'
    },
    {
      id: 3,
      patient: 'Robert Brown',
      medication: 'Metformin 850mg',
      dosage: '2x daily with meals',
      prescriber: 'Dr. Sarah Johnson',
      date: '2024-01-13',
      status: 'Pending'
    }
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Prescriptions</h1>
          <p className="text-muted-foreground">
            Manage patient prescriptions and medications.
          </p>
        </div>
        {canEdit && (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Prescription
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pill className="h-5 w-5" />
            Recent Prescriptions
          </CardTitle>
          <CardDescription>
            {canEdit ? 'Create and manage' : 'View'} patient prescriptions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockPrescriptions.map((prescription) => (
              <div key={prescription.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold">{prescription.patient}</h3>
                    <Badge variant={
                      prescription.status === 'Active' ? 'default' :
                      prescription.status === 'Filled' ? 'secondary' : 'outline'
                    }>
                      {prescription.status}
                    </Badge>
                  </div>
                  <p className="text-sm">
                    <strong>{prescription.medication}</strong> - {prescription.dosage}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Prescribed by {prescription.prescriber} on {prescription.date}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </Button>
                  {canEdit && (
                    <Button variant="outline" size="sm">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}