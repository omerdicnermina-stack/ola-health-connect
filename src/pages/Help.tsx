import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { HelpCircle, Search, MessageSquare, Phone, Mail, FileText } from 'lucide-react';

export default function Help() {
  const faqItems = [
    {
      question: 'How do I schedule a consultation?',
      answer: 'You can schedule a consultation through the "Visits" section or by clicking the "Schedule Visit" button from your dashboard.',
      category: 'Consultations'
    },
    {
      question: 'What should I do if I have technical issues during a call?',
      answer: 'If you experience technical difficulties, try refreshing your browser first. If issues persist, contact our technical support.',
      category: 'Technical'
    },
    {
      question: 'How can I access my prescription history?',
      answer: 'Navigate to the "Prescriptions" section to view all your past and current prescriptions.',
      category: 'Prescriptions'
    },
    {
      question: 'Can I message my healthcare provider directly?',
      answer: 'Yes, use the "Messages" section to send secure messages to your healthcare providers.',
      category: 'Communication'
    },
    {
      question: 'How do I update my profile information?',
      answer: 'Go to "Settings" and update your profile information in the "Profile Information" section.',
      category: 'Account'
    }
  ];

  const contactOptions = [
    {
      icon: Phone,
      title: '24/7 Support Hotline',
      description: 'Call us anytime for urgent assistance',
      contact: '1-800-OLA-HELP',
      action: 'Call Now'
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Send us a detailed message about your issue',
      contact: 'support@olahealth.com',
      action: 'Send Email'
    },
    {
      icon: MessageSquare,
      title: 'Live Chat',
      description: 'Chat with our support team in real-time',
      contact: 'Available 24/7',
      action: 'Start Chat'
    }
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Help & Support</h1>
        <p className="text-muted-foreground">
          Find answers to common questions and get support when you need it.
        </p>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search help articles, FAQs, and more..."
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact Options */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        {contactOptions.map((option, i) => (
          <Card key={i}>
            <CardHeader className="text-center">
              <option.icon className="h-8 w-8 text-primary mx-auto mb-2" />
              <CardTitle className="text-lg">{option.title}</CardTitle>
              <CardDescription>{option.description}</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="font-medium mb-3">{option.contact}</p>
              <Button variant="outline" className="w-full">
                {option.action}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Frequently Asked Questions
          </CardTitle>
          <CardDescription>
            Common questions and answers about using OLA HEALTH
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {faqItems.map((item, i) => (
              <div key={i} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold">{item.question}</h3>
                  <span className="text-xs bg-muted px-2 py-1 rounded">
                    {item.category}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Additional Resources */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Additional Resources
          </CardTitle>
          <CardDescription>
            More ways to get help and learn about our platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <Button variant="outline" className="h-auto p-4 justify-start">
              <div className="text-left">
                <div className="font-medium">User Guide</div>
                <div className="text-sm text-muted-foreground">
                  Complete guide to using the platform
                </div>
              </div>
            </Button>
            <Button variant="outline" className="h-auto p-4 justify-start">
              <div className="text-left">
                <div className="font-medium">Video Tutorials</div>
                <div className="text-sm text-muted-foreground">
                  Step-by-step video instructions
                </div>
              </div>
            </Button>
            <Button variant="outline" className="h-auto p-4 justify-start">
              <div className="text-left">
                <div className="font-medium">System Status</div>
                <div className="text-sm text-muted-foreground">
                  Check current system performance
                </div>
              </div>
            </Button>
            <Button variant="outline" className="h-auto p-4 justify-start">
              <div className="text-left">
                <div className="font-medium">Feature Requests</div>
                <div className="text-sm text-muted-foreground">
                  Suggest new features or improvements
                </div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}