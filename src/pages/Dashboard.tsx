import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Activity, 
  Clock, 
  TrendingUp, 
  MessageSquare, 
  Calendar,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

export default function Dashboard() {
  const { user, hasPermission } = useAuth();

  const renderVirtualQueueSummary = () => {
    if (!hasPermission('virtual_queue')) return null;

    return (
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Virtual Queue Summary
          </CardTitle>
          <CardDescription>Quick overview of patient queue</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">4</div>
              <p className="text-xs text-muted-foreground">Patients in Queue</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">12.5</div>
              <p className="text-xs text-muted-foreground">Avg Wait (min)</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span>Next Patient:</span>
              <span className="font-medium">John Doe</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span>High Priority:</span>
              <Badge variant="destructive" className="text-xs">1</Badge>
            </div>
          </div>
          <Button variant="outline" size="sm" className="w-full mt-4" asChild>
            <a href="/virtual-queue">View Full Queue</a>
          </Button>
        </CardContent>
      </Card>
    );
  };

  const renderAdminDashboard = () => (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+15% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Consultations</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">Currently ongoing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2 min</div>
            <p className="text-xs text-muted-foreground">-0.5 min from last week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {renderVirtualQueueSummary()}
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: 'New patient registered', user: 'System', time: '2 minutes ago', status: 'success' },
                { action: 'Prescription issued', user: 'Dr. Smith', time: '5 minutes ago', status: 'success' },
                { action: 'Patient missed appointment', user: 'System', time: '10 minutes ago', status: 'warning' },
                { action: 'New provider joined', user: 'HR Team', time: '1 hour ago', status: 'success' }
              ].map((item, i) => (
                <div key={i} className="flex items-center space-x-3">
                  {item.status === 'success' ? (
                    <CheckCircle className="h-4 w-4 text-success" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-warning" />
                  )}
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{item.action}</p>
                    <p className="text-xs text-muted-foreground">by {item.user} • {item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderProviderDashboard = () => (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">3 pending consultations</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Appointment</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2:30 PM</div>
            <p className="text-xs text-muted-foreground">Sarah Johnson</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">4 urgent</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Consultation</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18 min</div>
            <p className="text-xs text-muted-foreground">+2 min from yesterday</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {renderVirtualQueueSummary()}
      </div>
    </div>
  );

  const renderHRDashboard = () => (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Organization Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">245</div>
            <p className="text-xs text-muted-foreground">Hilton Hotel staff</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Plan Utilization</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">+5% this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Employees</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">189</div>
            <p className="text-xs text-muted-foreground">77% of total staff</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Invitations</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">Awaiting acceptance</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {user?.profile?.name}
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening with your {user?.profile?.role === 'HR Manager' ? 'organization' : 'practice'} today.
        </p>
      </div>

      {user?.profile?.role === 'HR Manager' && renderHRDashboard()}
      {(user?.profile?.role === 'Provider' || user?.profile?.role === 'Provider-Admin') && renderProviderDashboard()}
      {(user?.profile?.role === 'Admin' || user?.profile?.role === 'Super Admin') && renderAdminDashboard()}
    </div>
  );
}