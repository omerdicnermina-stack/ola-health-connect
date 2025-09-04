import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Send, Paperclip, Bot, Droplets, Moon, Dumbbell, Heart } from 'lucide-react';

export default function Messages() {
  const careCompanionMessages = [
      {
        id: 1,
        time: 'Just now',
        icon: Droplets,
        iconColor: 'text-blue-500',
        title: 'Hydration Reminder',
        message: 'Hi Keoni! Remember to drink plenty of water today. Aim for 8-10 glasses to help your body recover from your recent visit. Staying hydrated supports your overall wellbeing! 💧',
        isNew: true
      },
      {
        id: 2,
        time: '2 hours ago',
        icon: Moon,
        iconColor: 'text-purple-500',
        title: 'Sleep Quality Check',
        message: 'Good evening! Getting 7-9 hours of quality sleep is crucial for your recovery. Try establishing a relaxing bedtime routine and avoiding screens an hour before bed. Sweet dreams! 🌙',
        isNew: true
      },
      {
        id: 3,
        time: '1 day ago',
        icon: Dumbbell,
        iconColor: 'text-orange-500',
        title: 'Gentle Movement Reminder',
        message: 'Time for some gentle movement! Even a 15-minute walk can boost your mood and energy levels. Listen to your body and start with what feels comfortable. You\'ve got this! 💪',
        isNew: false
      },
      {
        id: 4,
        time: '2 days ago',
        icon: Heart,
        iconColor: 'text-red-500',
        title: 'Wellbeing Check-in',
        message: 'How are you feeling today? Remember to take time for activities that bring you joy and help you relax. Your mental health is just as important as your physical health. 🧘‍♂️',
        isNew: false
      },
    {
      id: 5,
      time: '1 week ago',
      icon: Bot,
      iconColor: 'text-green-500',
      title: 'Post-Visit Follow-up',
      message: 'Thank you for your recent visit! I\'ll be sending you personalized health reminders to support your wellness journey. Feel free to reach out if you have any questions about your care plan.',
      isNew: false
    }
  ];

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
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Bot className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">AI Care Companion</h3>
              <Badge variant="secondary" className="text-xs">Active</Badge>
            </div>
            
            <div className="space-y-3">
              {careCompanionMessages.map((message) => {
                const IconComponent = message.icon;
                return (
                  <div key={message.id} className="flex gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        <IconComponent className={`h-5 w-5 ${message.iconColor}`} />
                      </div>
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{message.title}</h4>
                        <div className="flex items-center gap-2">
                          {message.isNew && <Badge variant="default" className="text-xs">New</Badge>}
                          <span className="text-xs text-muted-foreground">{message.time}</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {message.message}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}