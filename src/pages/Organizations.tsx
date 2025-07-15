import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, Plus, Users, TrendingUp, Settings } from 'lucide-react';

export default function Organizations() {
  const mockOrganizations = [
    {
      id: 1,
      name: 'Hilton Hotel',
      type: 'Hospitality',
      employees: 245,
      activeUsers: 189,
      plan: 'Enterprise',
      utilization: '78%',
      status: 'Active'
    },
    {
      id: 2,
      name: 'Tech Corp Inc',
      type: 'Technology',
      employees: 156,
      activeUsers: 142,
      plan: 'Professional',
      utilization: '91%',
      status: 'Active'
    },
    {
      id: 3,
      name: 'Metro Hospital',
      type: 'Healthcare',
      employees: 89,
      activeUsers: 76,
      plan: 'Standard',
      utilization: '85%',
      status: 'Active'
    }
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Organizations</h1>
          <p className="text-muted-foreground">
            Manage corporate clients and their healthcare plans.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Organization
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Organization Directory
          </CardTitle>
          <CardDescription>
            Corporate clients and their telemedicine programs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockOrganizations.map((org) => (
              <div key={org.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-lg">{org.name}</h3>
                    <Badge variant="outline">{org.type}</Badge>
                    <Badge variant={org.status === 'Active' ? 'default' : 'secondary'}>
                      {org.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Total Employees</p>
                      <p className="font-medium">{org.employees}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Active Users</p>
                      <p className="font-medium">{org.activeUsers}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Plan</p>
                      <p className="font-medium">{org.plan}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Utilization</p>
                      <p className="font-medium text-success">{org.utilization}</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Users className="mr-2 h-4 w-4" />
                    Employees
                  </Button>
                  <Button variant="outline" size="sm">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Reports
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}