import React from 'react';
import { useUser } from '@/contexts/UserContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserCog, Plus, Edit, Trash2, Shield } from 'lucide-react';

export default function Users() {
  const { currentUser } = useUser();

  const mockUsers = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@olahealth.com',
      role: 'Provider',
      status: 'Active',
      lastLogin: '2024-01-15 14:30',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=32&h=32&fit=crop&crop=face'
    },
    {
      id: 2,
      name: 'Dr. Mike Chen',
      email: 'mike.chen@olahealth.com',
      role: 'Provider-Admin',
      status: 'Active',
      lastLogin: '2024-01-15 09:15',
      avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=32&h=32&fit=crop&crop=face'
    },
    {
      id: 3,
      name: 'Mary Wilson',
      email: 'hr@hiltonhotel.com',
      role: 'HR Manager',
      status: 'Active',
      lastLogin: '2024-01-14 16:45',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=32&h=32&fit=crop&crop=face'
    },
    {
      id: 4,
      name: 'Alex Rodriguez',
      email: 'alex.rodriguez@olahealth.com',
      role: 'Admin',
      status: 'Inactive',
      lastLogin: '2024-01-10 11:20',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face'
    }
  ];

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'Super Admin':
        return 'destructive';
      case 'Admin':
        return 'default';
      case 'Provider-Admin':
        return 'secondary';
      case 'Provider':
        return 'outline';
      case 'HR Manager':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const canDeleteUser = (userRole: string) => {
    if (currentUser?.role === 'Super Admin') return true;
    if (currentUser?.role === 'Admin' && userRole !== 'Admin' && userRole !== 'Super Admin') return true;
    return false;
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">
            Manage system users and their permissions.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCog className="h-5 w-5" />
            User Management
          </CardTitle>
          <CardDescription>
            View and manage all system users and their roles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">{user.name}</h3>
                      <Badge variant={getRoleBadgeVariant(user.role)}>
                        {user.role}
                      </Badge>
                      <Badge variant={user.status === 'Active' ? 'default' : 'secondary'}>
                        {user.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {user.email}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Last login: {user.lastLogin}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Shield className="mr-2 h-4 w-4" />
                    Permissions
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  {canDeleteUser(user.role) && (
                    <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
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