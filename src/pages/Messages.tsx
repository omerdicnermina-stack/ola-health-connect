import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Send, Paperclip } from 'lucide-react';

export default function Messages() {
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
        <p className="text-muted-foreground">
          Communicate with patients and team members.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Message Center
          </CardTitle>
          <CardDescription>
            Secure messaging platform for healthcare communication
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Message Center</h3>
            <p className="text-muted-foreground">
              This feature will allow secure communication between providers, patients, and staff.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}