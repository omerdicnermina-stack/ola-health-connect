import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Video, Phone, Calendar, DollarSign, Stethoscope } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VisitType {
  id: number;
  name: string;
  service: string;
  fee: number;
  modality: 'Video Call' | 'Phone Call' | 'In-Person';
  duration: number; // in minutes
  description: string;
  isActive: boolean;
}

export default function VisitTypes() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVisitType, setEditingVisitType] = useState<VisitType | null>(null);

  const mockVisitTypes: VisitType[] = [
    {
      id: 1,
      name: 'First Visit - General',
      service: 'General Medicine',
      fee: 149,
      modality: 'Video Call',
      duration: 30,
      description: 'Initial comprehensive consultation for new patients',
      isActive: true
    },
    {
      id: 2,
      name: 'Follow-up Visit',
      service: 'General Medicine',
      fee: 89,
      modality: 'Video Call',
      duration: 15,
      description: 'Follow-up consultation for existing patients',
      isActive: true
    },
    {
      id: 3,
      name: 'Prescription Refill',
      service: 'General Medicine',
      fee: 39,
      modality: 'Phone Call',
      duration: 10,
      description: 'Quick consultation for prescription renewals',
      isActive: true
    },
    {
      id: 4,
      name: 'Mental Health Initial',
      service: 'Mental Health',
      fee: 199,
      modality: 'Video Call',
      duration: 45,
      description: 'Initial mental health assessment and consultation',
      isActive: true
    },
    {
      id: 5,
      name: 'Mental Health Follow-up',
      service: 'Mental Health',
      fee: 129,
      modality: 'Video Call',
      duration: 30,
      description: 'Follow-up mental health consultation',
      isActive: true
    },
    {
      id: 6,
      name: 'Urgent Care',
      service: 'Urgent Care',
      fee: 179,
      modality: 'Video Call',
      duration: 20,
      description: 'Urgent medical consultation for immediate concerns',
      isActive: true
    },
    {
      id: 7,
      name: 'Lab Review',
      service: 'General Medicine',
      fee: 49,
      modality: 'Phone Call',
      duration: 10,
      description: 'Review and discussion of lab results',
      isActive: true
    }
  ];

  const services = [
    'General Medicine',
    'Mental Health',
    'Urgent Care',
    'Pediatrics',
    'Dermatology',
    'Women\'s Health'
  ];

  const modalities = ['Video Call', 'Phone Call', 'In-Person'];

  const getModalityIcon = (modality: string) => {
    switch (modality) {
      case 'Video Call':
        return <Video className="h-4 w-4" />;
      case 'Phone Call':
        return <Phone className="h-4 w-4" />;
      case 'In-Person':
        return <Calendar className="h-4 w-4" />;
      default:
        return <Video className="h-4 w-4" />;
    }
  };

  const getModalityVariant = (modality: string) => {
    switch (modality) {
      case 'Video Call':
        return 'default';
      case 'Phone Call':
        return 'secondary';
      case 'In-Person':
        return 'outline';
      default:
        return 'default';
    }
  };

  const handleCreateVisitType = () => {
    toast({
      title: "Visit type created",
      description: "New visit type has been added successfully.",
    });
    setIsDialogOpen(false);
  };

  const handleEditVisitType = (visitType: VisitType) => {
    setEditingVisitType(visitType);
    setIsDialogOpen(true);
  };

  const handleDeleteVisitType = (id: number) => {
    toast({
      title: "Visit type deleted",
      description: "The visit type has been removed.",
    });
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Visit Types</h1>
          <p className="text-muted-foreground">
            Manage different types of medical visits with their fees and modalities.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingVisitType(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Visit Type
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingVisitType ? 'Edit Visit Type' : 'Create New Visit Type'}
              </DialogTitle>
              <DialogDescription>
                Configure the visit type details, associated service, fee, and modality.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Visit Type Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., First Visit - General"
                  defaultValue={editingVisitType?.name}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="service">Associated Service</Label>
                <Select defaultValue={editingVisitType?.service}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service} value={service}>
                        {service}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="fee">Fee ($)</Label>
                  <Input
                    id="fee"
                    type="number"
                    placeholder="149"
                    defaultValue={editingVisitType?.fee}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="duration">Duration (min)</Label>
                  <Input
                    id="duration"
                    type="number"
                    placeholder="30"
                    defaultValue={editingVisitType?.duration}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="modality">Modality</Label>
                <Select defaultValue={editingVisitType?.modality}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select modality" />
                  </SelectTrigger>
                  <SelectContent>
                    {modalities.map((modality) => (
                      <SelectItem key={modality} value={modality}>
                        <div className="flex items-center gap-2">
                          {getModalityIcon(modality)}
                          {modality}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Brief description of the visit type"
                  defaultValue={editingVisitType?.description}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateVisitType}>
                {editingVisitType ? 'Save Changes' : 'Create Visit Type'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5" />
            Visit Types Configuration
          </CardTitle>
          <CardDescription>
            Manage visit types, their associated services, fees, and consultation modalities.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Visit Type</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Fee</TableHead>
                <TableHead>Modality</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockVisitTypes.map((visitType) => (
                <TableRow key={visitType.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{visitType.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {visitType.description}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{visitType.service}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      <span className="font-medium">{visitType.fee}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getModalityVariant(visitType.modality)} className="gap-1">
                      {getModalityIcon(visitType.modality)}
                      {visitType.modality}
                    </Badge>
                  </TableCell>
                  <TableCell>{visitType.duration} min</TableCell>
                  <TableCell>
                    <Badge variant={visitType.isActive ? 'default' : 'secondary'}>
                      {visitType.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditVisitType(visitType)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteVisitType(visitType.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}