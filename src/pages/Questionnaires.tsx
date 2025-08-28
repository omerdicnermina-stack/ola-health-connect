import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import QuestionnaireBuilder from '@/components/QuestionnaireBuilder';
import { 
  FileText, 
  Plus, 
  Edit3,
  Trash2,
  Copy,
  Eye,
  Settings,
  Clock,
  User,
  Lock,
  CheckSquare
} from 'lucide-react';

interface Questionnaire {
  id: string;
  title: string;
  description: string;
  category: string;
  is_active: boolean;
  created_by: string;
  organization: string | null;
  created_at: string;
  updated_at: string;
  creator_name?: string;
  question_count?: number;
}

export default function Questionnaires() {
  const { user, hasPermission } = useAuth();
  const { toast } = useToast();
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingQuestionnaire, setEditingQuestionnaire] = useState<Questionnaire | null>(null);
  const [newQuestionnaire, setNewQuestionnaire] = useState({
    title: '',
    description: '',
    category: '',
    organization: user?.profile.organization || ''
  });

  // Check if user can create questionnaires
  const canCreateQuestionnaires = user?.profile.role && 
    ['Admin', 'Super Admin', 'Provider', 'Provider-Admin', 'Manager'].includes(user.profile.role);

  const categories = [
    { value: 'pre-visit', label: 'Pre-Visit', color: 'bg-blue-100 text-blue-800' },
    { value: 'intake', label: 'Intake Form', color: 'bg-green-100 text-green-800' },
    { value: 'assessment', label: 'Assessment', color: 'bg-purple-100 text-purple-800' },
    { value: 'post-visit', label: 'Post-Visit', color: 'bg-orange-100 text-orange-800' },
    { value: 'screening', label: 'Screening', color: 'bg-pink-100 text-pink-800' },
    { value: 'follow-up', label: 'Follow-up', color: 'bg-indigo-100 text-indigo-800' }
  ];

  useEffect(() => {
    if (canCreateQuestionnaires) {
      fetchQuestionnaires();
    }
    setLoading(false);
  }, [canCreateQuestionnaires]);

  const fetchQuestionnaires = async () => {
    try {
      const { data, error } = await supabase
        .from('questionnaires')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;

      // Get question counts and creator names for each questionnaire
      const questionnairesWithCounts = await Promise.all(
        (data || []).map(async (q) => {
          const { count } = await supabase
            .from('questions')
            .select('*', { count: 'exact', head: true })
            .eq('questionnaire_id', q.id);

          // Get creator name from user_profiles
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('name')
            .eq('user_id', q.created_by)
            .single();

          return {
            ...q,
            creator_name: profile?.name || 'Unknown',
            question_count: count || 0
          };
        })
      );

      setQuestionnaires(questionnairesWithCounts);
    } catch (error) {
      console.error('Error fetching questionnaires:', error);
      toast({
        title: "Error",
        description: "Failed to load questionnaires",
        variant: "destructive",
      });
    }
  };

  const handleCreateQuestionnaire = async () => {
    if (!newQuestionnaire.title.trim() || !newQuestionnaire.category) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('questionnaires')
        .insert([{
          title: newQuestionnaire.title.trim(),
          description: newQuestionnaire.description.trim(),
          category: newQuestionnaire.category,
          organization: newQuestionnaire.organization.trim() || null,
          created_by: user?.id
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Questionnaire created successfully",
      });

      setShowCreateDialog(false);
      setNewQuestionnaire({
        title: '',
        description: '',
        category: '',
        organization: user?.profile.organization || ''
      });
      fetchQuestionnaires();
    } catch (error) {
      console.error('Error creating questionnaire:', error);
      toast({
        title: "Error",
        description: "Failed to create questionnaire",
        variant: "destructive",
      });
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('questionnaires')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Questionnaire ${!currentStatus ? 'activated' : 'deactivated'}`,
      });

      fetchQuestionnaires();
    } catch (error) {
      console.error('Error updating questionnaire:', error);
      toast({
        title: "Error",
        description: "Failed to update questionnaire",
        variant: "destructive",
      });
    }
  };

  const handleDeleteQuestionnaire = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this questionnaire? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('questionnaires')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Questionnaire deleted successfully",
      });

      fetchQuestionnaires();
    } catch (error) {
      console.error('Error deleting questionnaire:', error);
      toast({
        title: "Error",
        description: "Failed to delete questionnaire",
        variant: "destructive",
      });
    }
  };

  const filteredQuestionnaires = questionnaires.filter(q => 
    selectedCategory === 'all' || q.category === selectedCategory
  );

  const getCategoryBadge = (category: string) => {
    const categoryInfo = categories.find(c => c.value === category);
    return categoryInfo ? (
      <Badge className={categoryInfo.color}>
        {categoryInfo.label}
      </Badge>
    ) : (
      <Badge variant="secondary">{category}</Badge>
    );
  };

  if (!canCreateQuestionnaires) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <Lock className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-2">Access Restricted</h1>
          <p className="text-muted-foreground mb-4">
            Questionnaire management is only available to authorized staff members.
          </p>
          <Alert className="max-w-md mx-auto">
            <AlertDescription>
              You are logged in as <strong>{user?.profile.name}</strong> ({user?.profile.role}). 
              Only Admins, Providers, Provider-Admins, and Managers can create and manage questionnaires.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading questionnaires...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Questionnaires</h1>
          <p className="text-muted-foreground">Create and manage patient questionnaires, intake forms, and assessments</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Questionnaire
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Questionnaire</DialogTitle>
              <DialogDescription>
                Create a new questionnaire for patients to complete before, during, or after their visits.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input 
                  id="title"
                  placeholder="e.g., Pre-Visit Health Assessment"
                  value={newQuestionnaire.title}
                  onChange={(e) => setNewQuestionnaire({
                    ...newQuestionnaire,
                    title: e.target.value
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description"
                  placeholder="Brief description of this questionnaire's purpose"
                  value={newQuestionnaire.description}
                  onChange={(e) => setNewQuestionnaire({
                    ...newQuestionnaire,
                    description: e.target.value
                  })}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select 
                    value={newQuestionnaire.category} 
                    onValueChange={(value) => setNewQuestionnaire({
                      ...newQuestionnaire,
                      category: value
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="organization">Organization</Label>
                  <Input 
                    id="organization"
                    placeholder="Optional organization name"
                    value={newQuestionnaire.organization}
                    onChange={(e) => setNewQuestionnaire({
                      ...newQuestionnaire,
                      organization: e.target.value
                    })}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateQuestionnaire}>
                Create Questionnaire
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter Categories */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('all')}
            >
              All ({questionnaires.length})
            </Button>
            {categories.map(category => {
              const count = questionnaires.filter(q => q.category === category.value).length;
              return count > 0 ? (
                <Button
                  key={category.value}
                  variant={selectedCategory === category.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.value)}
                >
                  {category.label} ({count})
                </Button>
              ) : null;
            })}
          </div>
        </CardContent>
      </Card>

      {/* Questionnaires Grid */}
      {filteredQuestionnaires.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">
              {selectedCategory === 'all' ? 'No questionnaires yet' : `No ${selectedCategory} questionnaires`}
            </h3>
            <p className="text-muted-foreground mb-4">
              {selectedCategory === 'all' 
                ? 'Get started by creating your first questionnaire'
                : `Create your first ${selectedCategory} questionnaire`
              }
            </p>
            {selectedCategory === 'all' && (
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Questionnaire
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredQuestionnaires.map((questionnaire) => (
            <Card key={questionnaire.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg truncate">{questionnaire.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      {getCategoryBadge(questionnaire.category)}
                      <Badge variant={questionnaire.is_active ? 'default' : 'secondary'}>
                        {questionnaire.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                </div>
                {questionnaire.description && (
                  <CardDescription className="text-sm line-clamp-2">
                    {questionnaire.description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="h-4 w-4" />
                    <span>{questionnaire.question_count} questions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{questionnaire.creator_name}</span>
                  </div>
                </div>
                
                {questionnaire.organization && (
                  <div className="text-sm text-muted-foreground">
                    Organization: {questionnaire.organization}
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Updated {new Date(questionnaire.updated_at).toLocaleDateString()}</span>
                </div>

                <Separator />

                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setEditingQuestionnaire(questionnaire)}
                  >
                    <Edit3 className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleToggleActive(questionnaire.id, questionnaire.is_active)}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleDeleteQuestionnaire(questionnaire.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Questionnaire Builder Modal */}
      {editingQuestionnaire && (
        <div className="fixed inset-0 bg-background z-50 overflow-auto">
          <QuestionnaireBuilder
            questionnaireId={editingQuestionnaire.id}
            title={editingQuestionnaire.title}
            onClose={() => setEditingQuestionnaire(null)}
          />
        </div>
      )}
    </div>
  );
}