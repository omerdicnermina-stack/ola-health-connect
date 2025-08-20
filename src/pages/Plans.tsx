import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Plus, Edit, Users, Check } from 'lucide-react';

export default function Plans() {
  const { hasPermission, user } = useAuth();
  const canManagePlans = hasPermission('manage_plans');
  const canAssignPlans = user?.profile?.role === 'HR Manager';

  const mockPlans = [
    {
      id: 1,
      name: 'Basic Care',
      description: 'Essential telemedicine services for individuals',
      price: '$29/month',
      features: [
        'Unlimited consultations',
        'Basic prescription services',
        '24/7 support',
        'Mobile app access'
      ],
      organizations: 3,
      users: 245,
      status: 'Active'
    },
    {
      id: 2,
      name: 'Professional',
      description: 'Comprehensive healthcare for teams and small businesses',
      price: '$49/month',
      features: [
        'All Basic features',
        'Mental health support',
        'Specialist consultations',
        'Health records management',
        'Admin dashboard'
      ],
      organizations: 8,
      users: 567,
      status: 'Active'
    },
    {
      id: 3,
      name: 'Enterprise',
      description: 'Full-featured solution for large organizations',
      price: '$89/month',
      features: [
        'All Professional features',
        'Custom integrations',
        'Advanced analytics',
        'Dedicated support',
        'White-label options',
        'API access'
      ],
      organizations: 2,
      users: 892,
      status: 'Active'
    },
    {
      id: 4,
      name: 'Family Plan',
      description: 'Affordable healthcare for families',
      price: '$79/month',
      features: [
        'Up to 6 family members',
        'Pediatric care included',
        'Family health tracking',
        'Shared prescriptions',
        'Emergency consultations'
      ],
      organizations: 0,
      users: 156,
      status: 'Limited'
    }
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Plans</h1>
          <p className="text-muted-foreground">
            Manage subscription plans and pricing tiers.
          </p>
        </div>
        {canManagePlans && (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Plan
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {mockPlans.map((plan) => (
          <Card key={plan.id} className="relative">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription className="mt-2">
                    {plan.description}
                  </CardDescription>
                </div>
                <Badge variant={plan.status === 'Active' ? 'default' : 'secondary'}>
                  {plan.status}
                </Badge>
              </div>
              <div className="text-3xl font-bold text-primary">{plan.price}</div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Features Included:</h4>
                <ul className="space-y-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-success" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="text-center">
                  <div className="text-2xl font-bold">{plan.organizations}</div>
                  <div className="text-xs text-muted-foreground">Organizations</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{plan.users}</div>
                  <div className="text-xs text-muted-foreground">Active Users</div>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                {canAssignPlans && (
                  <Button variant="default" size="sm" className="flex-1">
                    <Users className="mr-2 h-4 w-4" />
                    Assign to Org
                  </Button>
                )}
                {canManagePlans && (
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Plan
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {canAssignPlans && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Plan Assignment
            </CardTitle>
            <CardDescription>
              Assign plans to your organization's employees
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Use this section to manage plan assignments for your organization's employees.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}