import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  Edit3,
  Eye,
  Save,
  ArrowUp,
  ArrowDown,
  Copy,
  Settings2,
  HelpCircle,
  CheckSquare,
  Type,
  Calendar,
  Hash,
  ToggleLeft,
  List
} from 'lucide-react';

interface Question {
  id?: string;
  questionnaire_id?: string;
  question_text: string;
  question_type: string;
  options?: string[];
  is_required: boolean;
  order_index: number;
  conditions?: QuestionCondition[];
}

interface QuestionCondition {
  id?: string;
  condition_question_id: string;
  condition_operator: string;
  condition_value: string;
  action: string;
}

interface QuestionnaireBuilderProps {
  questionnaireId: string;
  title: string;
  onClose: () => void;
}

const questionTypes = [
  { value: 'text', label: 'Short Text', icon: Type },
  { value: 'textarea', label: 'Long Text', icon: Type },
  { value: 'radio', label: 'Single Choice', icon: CheckSquare },
  { value: 'checkbox', label: 'Multiple Choice', icon: CheckSquare },
  { value: 'select', label: 'Dropdown', icon: List },
  { value: 'date', label: 'Date', icon: Calendar },
  { value: 'number', label: 'Number', icon: Hash },
  { value: 'boolean', label: 'Yes/No', icon: ToggleLeft },
];

const conditionOperators = [
  { value: 'equals', label: 'Equals' },
  { value: 'not_equals', label: 'Does not equal' },
  { value: 'contains', label: 'Contains' },
  { value: 'greater_than', label: 'Greater than' },
  { value: 'less_than', label: 'Less than' },
];

export default function QuestionnaireBuilder({ questionnaireId, title, onClose }: QuestionnaireBuilderProps) {
  const { toast } = useToast();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [newQuestion, setNewQuestion] = useState<Question>({
    question_text: '',
    question_type: 'text',
    is_required: false,
    order_index: 0,
    options: []
  });

  useEffect(() => {
    fetchQuestions();
  }, [questionnaireId]);

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select(`
          *,
          question_conditions (*)
        `)
        .eq('questionnaire_id', questionnaireId)
        .order('order_index');

      if (error) throw error;

      const questionsWithConditions = (data || []).map(q => ({
        ...q,
        options: q.options ? (Array.isArray(q.options) ? q.options as string[] : []) : [],
        conditions: q.question_conditions || []
      }));

      setQuestions(questionsWithConditions);
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast({
        title: "Error",
        description: "Failed to load questions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestion = async () => {
    if (!newQuestion.question_text.trim()) {
      toast({
        title: "Error",
        description: "Question text is required",
        variant: "destructive",
      });
      return;
    }

    try {
      const maxOrder = Math.max(...questions.map(q => q.order_index), -1);
      const questionData = {
        ...newQuestion,
        questionnaire_id: questionnaireId,
        order_index: maxOrder + 1,
        options: ['radio', 'checkbox', 'select'].includes(newQuestion.question_type) 
          ? newQuestion.options 
          : null
      };

      const { data, error } = await supabase
        .from('questions')
        .insert([questionData])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Question added successfully",
      });

      setShowAddQuestion(false);
      setNewQuestion({
        question_text: '',
        question_type: 'text',
        is_required: false,
        order_index: 0,
        options: []
      });
      fetchQuestions();
    } catch (error) {
      console.error('Error adding question:', error);
      toast({
        title: "Error",
        description: "Failed to add question",
        variant: "destructive",
      });
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (!window.confirm('Are you sure you want to delete this question?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('questions')
        .delete()
        .eq('id', questionId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Question deleted successfully",
      });

      fetchQuestions();
    } catch (error) {
      console.error('Error deleting question:', error);
      toast({
        title: "Error",
        description: "Failed to delete question",
        variant: "destructive",
      });
    }
  };

  const handleMoveQuestion = async (questionId: string, direction: 'up' | 'down') => {
    const currentIndex = questions.findIndex(q => q.id === questionId);
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (newIndex < 0 || newIndex >= questions.length) return;

    const updatedQuestions = [...questions];
    [updatedQuestions[currentIndex], updatedQuestions[newIndex]] = 
    [updatedQuestions[newIndex], updatedQuestions[currentIndex]];

    // Update order indices
    const updates = updatedQuestions.map((q, index) => ({
      id: q.id,
      order_index: index
    }));

    try {
      for (const update of updates) {
        const { error } = await supabase
          .from('questions')
          .update({ order_index: update.order_index })
          .eq('id', update.id);

        if (error) throw error;
      }

      fetchQuestions();
    } catch (error) {
      console.error('Error reordering questions:', error);
      toast({
        title: "Error",
        description: "Failed to reorder questions",
        variant: "destructive",
      });
    }
  };

  const handleAddOption = (questionId?: string) => {
    if (questionId) {
      // Handle editing existing question options
      const question = questions.find(q => q.id === questionId);
      if (question) {
        const newOptions = [...(question.options || []), ''];
        setQuestions(prev => prev.map(q => 
          q.id === questionId 
            ? { ...q, options: newOptions }
            : q
        ));
      }
    } else {
      // Handle new question options
      setNewQuestion(prev => ({
        ...prev,
        options: [...(prev.options || []), '']
      }));
    }
  };

  const handleUpdateOption = (index: number, value: string, questionId?: string) => {
    if (questionId) {
      setQuestions(prev => prev.map(q => 
        q.id === questionId 
          ? { 
              ...q, 
              options: (q.options || []).map((opt, i) => i === index ? value : opt)
            }
          : q
      ));
    } else {
      setNewQuestion(prev => ({
        ...prev,
        options: (prev.options || []).map((opt, i) => i === index ? value : opt)
      }));
    }
  };

  const handleRemoveOption = (index: number, questionId?: string) => {
    if (questionId) {
      setQuestions(prev => prev.map(q => 
        q.id === questionId 
          ? { 
              ...q, 
              options: (q.options || []).filter((_, i) => i !== index)
            }
          : q
      ));
    } else {
      setNewQuestion(prev => ({
        ...prev,
        options: (prev.options || []).filter((_, i) => i !== index)
      }));
    }
  };

  const getQuestionTypeIcon = (type: string) => {
    const questionType = questionTypes.find(t => t.value === type);
    const IconComponent = questionType?.icon || Type;
    return <IconComponent className="h-4 w-4" />;
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Loading questionnaire builder...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Questionnaire Builder</h2>
          <p className="text-muted-foreground">Editing: {title}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Dialog open={showAddQuestion} onOpenChange={setShowAddQuestion}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Question
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {questions.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <HelpCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No questions yet</h3>
              <p className="text-muted-foreground mb-4">
                Start building your questionnaire by adding your first question
              </p>
              <Button onClick={() => setShowAddQuestion(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Question
              </Button>
            </CardContent>
          </Card>
        ) : (
          questions.map((question, index) => (
            <Card key={question.id} className="hover:shadow-sm transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  <div className="flex flex-col gap-1 mt-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMoveQuestion(question.id!, 'up')}
                      disabled={index === 0}
                      className="h-6 w-6 p-0"
                    >
                      <ArrowUp className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMoveQuestion(question.id!, 'down')}
                      disabled={index === questions.length - 1}
                      className="h-6 w-6 p-0"
                    >
                      <ArrowDown className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">
                        Q{index + 1}
                      </Badge>
                      <div className="flex items-center gap-1">
                        {getQuestionTypeIcon(question.question_type)}
                        <span className="text-sm text-muted-foreground">
                          {questionTypes.find(t => t.value === question.question_type)?.label}
                        </span>
                      </div>
                      {question.is_required && (
                        <Badge variant="secondary" className="text-xs">Required</Badge>
                      )}
                      {question.conditions && question.conditions.length > 0 && (
                        <Badge variant="outline" className="text-xs">
                          Conditional
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-base">{question.question_text}</CardTitle>
                    
                    {['radio', 'checkbox', 'select'].includes(question.question_type) && question.options && (
                      <div className="mt-2 space-y-1">
                        {question.options.map((option, optIndex) => (
                          <div key={optIndex} className="text-sm text-muted-foreground flex items-center gap-2">
                            <span className="w-4 h-4 rounded border border-muted-foreground/30" />
                            {option}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingQuestion(question)}
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteQuestion(question.id!)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))
        )}
      </div>

      {/* Add Question Dialog */}
      <Dialog open={showAddQuestion} onOpenChange={setShowAddQuestion}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Question</DialogTitle>
            <DialogDescription>
              Create a new question for your questionnaire
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="question-text">Question Text *</Label>
              <Textarea 
                id="question-text"
                placeholder="Enter your question here..."
                value={newQuestion.question_text}
                onChange={(e) => setNewQuestion({
                  ...newQuestion,
                  question_text: e.target.value
                })}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Question Type *</Label>
              <Select 
                value={newQuestion.question_type} 
                onValueChange={(value) => setNewQuestion({
                  ...newQuestion,
                  question_type: value,
                  options: ['radio', 'checkbox', 'select'].includes(value) ? [''] : []
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select question type" />
                </SelectTrigger>
                <SelectContent>
                  {questionTypes.map(type => {
                    const IconComponent = type.icon;
                    return (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <IconComponent className="h-4 w-4" />
                          {type.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Options for choice-type questions */}
            {['radio', 'checkbox', 'select'].includes(newQuestion.question_type) && (
              <div className="space-y-2">
                <Label>Options</Label>
                <div className="space-y-2">
                  {(newQuestion.options || []).map((option, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder={`Option ${index + 1}`}
                        value={option}
                        onChange={(e) => handleUpdateOption(index, e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveOption(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddOption()}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Option
                  </Button>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="required"
                checked={newQuestion.is_required}
                onCheckedChange={(checked) => setNewQuestion({
                  ...newQuestion,
                  is_required: checked as boolean
                })}
              />
              <Label htmlFor="required">Required field</Label>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowAddQuestion(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddQuestion}>
              Add Question
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}