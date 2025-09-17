import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { 
  Calendar, 
  Clock, 
  FileText, 
  User, 
  AlertCircle,
  CheckCircle2,
  Video,
  Phone,
  MapPin,
  ArrowRight
} from 'lucide-react';

interface Visit {
  id: string;
  visit_type: string;
  visit_date: string;
  status: string;
  chief_complaint?: string;
  diagnosis?: string;
  treatment_plan?: string;
  notes?: string;
  follow_up_needed: boolean;
  follow_up_date?: string;
  follow_up_notes?: string;
  visit_modality: string;
  provider_id?: string;
}

interface ProviderProfile {
  name: string;
  specialty?: string;
}

export default function LastVisitCard() {
  const { user } = useAuth();
  const [lastVisit, setLastVisit] = useState<Visit | null>(null);
  const [providerInfo, setProviderInfo] = useState<ProviderProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const fetchLastVisit = async () => {
      try {
        // Fetch the most recent completed visit
        const { data: visits, error } = await supabase
          .from('visits')
          .select('*')
          .eq('patient_id', user.id)
          .eq('status', 'completed')
          .order('visit_date', { ascending: false })
          .limit(1);

        if (error) {
          console.error('Error fetching visits:', error);
          return;
        }

        if (visits && visits.length > 0) {
          const visit = visits[0];
          setLastVisit(visit);

          // Fetch provider information if available
          if (visit.provider_id) {
            const { data: provider } = await supabase
              .from('user_profiles')
              .select('name, specialty')
              .eq('user_id', visit.provider_id)
              .single();

            if (provider) {
              setProviderInfo(provider);
            }
          } else {
            // Set mock provider info for demo visits
            const mockProviders: { [key: string]: ProviderProfile } = {
              'Urgent Care Visit': { name: 'Sarah Johnson', specialty: 'Internal Medicine' },
              'Dermatology Consultation': { name: 'Carlos Martinez', specialty: 'Dermatology' },
              'Telehealth Consultation': { name: 'Jennifer Williams', specialty: 'Rheumatology' },
              'Wellness Check-up': { name: 'Lisa Chen', specialty: 'Family Medicine' },
              'Mental Health Follow-up': { name: 'Michael Thompson', specialty: 'Psychiatry' }
            };
            setProviderInfo(mockProviders[visit.visit_type] || { name: 'Dr. Smith', specialty: 'General Practice' });
          }
        }
      } catch (error) {
        console.error('Error fetching last visit:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLastVisit();
  }, [user?.id]);

  const getModalityIcon = (modality: string) => {
    switch (modality) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'phone': return <Phone className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  const getModalityColor = (modality: string) => {
    switch (modality) {
      case 'video': return 'bg-blue-100 text-blue-800';
      case 'phone': return 'bg-green-100 text-green-800';
      default: return 'bg-purple-100 text-purple-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isFollowUpOverdue = (followUpDate?: string) => {
    if (!followUpDate) return false;
    return new Date(followUpDate) < new Date();
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Last Visit Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!lastVisit) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Last Visit Summary
          </CardTitle>
          <CardDescription>Your recent healthcare visits</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No recent visits found</p>
            <p className="text-sm text-muted-foreground mt-2">
              Schedule your first visit to get started with your health journey
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Last Visit Summary
        </CardTitle>
        <CardDescription>Your most recent healthcare visit</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Visit Details */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge className={getModalityColor(lastVisit.visit_modality)}>
                <div className="flex items-center gap-1">
                  {getModalityIcon(lastVisit.visit_modality)}
                  <span className="capitalize">{lastVisit.visit_modality}</span>
                </div>
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                {lastVisit.status.charAt(0).toUpperCase() + lastVisit.status.slice(1)}
              </Badge>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg">{lastVisit.visit_type}</h4>
              {providerInfo && (
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <User className="h-4 w-4" />
                  Dr. {providerInfo.name}
                  {providerInfo.specialty && ` - ${providerInfo.specialty}`}
                </p>
              )}
            </div>

            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {formatDate(lastVisit.visit_date)}
            </div>
          </div>

          <div className="space-y-3">
            {lastVisit.chief_complaint && (
              <div>
                <h5 className="font-medium text-sm text-muted-foreground">Chief Complaint</h5>
                <p className="text-sm">{lastVisit.chief_complaint}</p>
              </div>
            )}
            
            {lastVisit.diagnosis && (
              <div>
                <h5 className="font-medium text-sm text-muted-foreground">Diagnosis</h5>
                <p className="text-sm">{lastVisit.diagnosis}</p>
              </div>
            )}
          </div>
        </div>

        {/* Treatment Plan */}
        {lastVisit.treatment_plan && (
          <div>
            <h5 className="font-medium text-sm text-muted-foreground mb-2">Treatment Plan</h5>
            <p className="text-sm bg-blue-50 p-3 rounded-lg border border-blue-100">
              {lastVisit.treatment_plan}
            </p>
          </div>
        )}

        {/* Follow-up Recommendations */}
        {lastVisit.follow_up_needed && (
          <div className="border-t pt-4">
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-full ${
                isFollowUpOverdue(lastVisit.follow_up_date) 
                  ? 'bg-red-100 text-red-600' 
                  : 'bg-yellow-100 text-yellow-600'
              }`}>
                {isFollowUpOverdue(lastVisit.follow_up_date) ? (
                  <AlertCircle className="h-4 w-4" />
                ) : (
                  <Clock className="h-4 w-4" />
                )}
              </div>
              <div className="flex-1">
                <h5 className="font-medium text-sm flex items-center gap-2">
                  Follow-up Recommended
                  {isFollowUpOverdue(lastVisit.follow_up_date) && (
                    <Badge variant="destructive" className="text-xs">Overdue</Badge>
                  )}
                </h5>
                
                {lastVisit.follow_up_date && (
                  <p className="text-sm text-muted-foreground mt-1">
                    <strong>Recommended by:</strong> {formatDate(lastVisit.follow_up_date)}
                  </p>
                )}
                
                {lastVisit.follow_up_notes && (
                  <p className="text-sm mt-2">{lastVisit.follow_up_notes}</p>
                )}
                
                <div className="flex gap-2 mt-3">
                  <Button size="sm" className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Schedule Follow-up
                  </Button>
                  <Button size="sm" variant="outline" className="flex items-center gap-1">
                    <ArrowRight className="h-4 w-4" />
                    Start Instant Visit
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Provider Notes */}
        {lastVisit.notes && (
          <div>
            <h5 className="font-medium text-sm text-muted-foreground mb-2">Provider Notes</h5>
            <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
              {lastVisit.notes}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}