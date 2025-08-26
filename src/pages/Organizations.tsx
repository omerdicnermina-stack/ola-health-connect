import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, Plus, Users, TrendingUp, Settings, Upload, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Organizations() {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const mockOrganizations = [
    {
      id: 1,
      name: 'Hilton Hotel',
      type: 'Hospitality',
      employees: 245,
      activeUsers: 189,
      plan: 'Enterprise',
      utilization: '78%',
      status: 'Active'
    },
    {
      id: 2,
      name: 'Tech Corp Inc',
      type: 'Technology',
      employees: 156,
      activeUsers: 142,
      plan: 'Professional',
      utilization: '91%',
      status: 'Active'
    },
    {
      id: 3,
      name: 'Metro Hospital',
      type: 'Healthcare',
      employees: 89,
      activeUsers: 76,
      plan: 'Standard',
      utilization: '85%',
      status: 'Active'
    }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const allowedTypes = ['.csv', '.xlsx', '.xls'];
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      
      if (allowedTypes.includes(fileExtension)) {
        setSelectedFile(file);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a CSV or Excel file (.csv, .xlsx, .xls)",
          variant: "destructive"
        });
      }
    }
  };

  const handleUploadSubmit = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    try {
      // Simulate upload process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Employee census uploaded successfully",
        description: `${selectedFile.name} has been processed and ${Math.floor(Math.random() * 200 + 50)} employees were imported.`,
      });
      
      setSelectedFile(null);
      // Reset file input
      const fileInput = document.getElementById('employee-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error processing your file. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const downloadTemplate = () => {
    const csvContent = "First Name,Last Name,Email,Department,Job Title,Employee ID\nJohn,Doe,john.doe@company.com,Engineering,Software Engineer,EMP001\nJane,Smith,jane.smith@company.com,HR,HR Manager,EMP002";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'employee_census_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Organizations</h1>
          <p className="text-muted-foreground">
            Manage corporate clients and their healthcare plans.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Organization
        </Button>
      </div>

      <Tabs defaultValue="directory" className="space-y-6">
        <TabsList>
          <TabsTrigger value="directory">Organization Directory</TabsTrigger>
          <TabsTrigger value="upload">Employee Census Upload</TabsTrigger>
        </TabsList>

        <TabsContent value="directory">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Organization Directory
              </CardTitle>
              <CardDescription>
                Corporate clients and their telemedicine programs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockOrganizations.map((org) => (
                  <div key={org.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-lg">{org.name}</h3>
                        <Badge variant="outline">{org.type}</Badge>
                        <Badge variant={org.status === 'Active' ? 'default' : 'secondary'}>
                          {org.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Total Employees</p>
                          <p className="font-medium">{org.employees}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Active Users</p>
                          <p className="font-medium">{org.activeUsers}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Plan</p>
                          <p className="font-medium">{org.plan}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Utilization</p>
                          <p className="font-medium text-success">{org.utilization}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Users className="mr-2 h-4 w-4" />
                        Employees
                      </Button>
                      <Button variant="outline" size="sm">
                        <TrendingUp className="mr-2 h-4 w-4" />
                        Reports
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upload">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Upload Employee Census
                </CardTitle>
                <CardDescription>
                  Import employee data from CSV or Excel files
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="employee-upload">Select File</Label>
                  <Input
                    id="employee-upload"
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                  />
                  <p className="text-sm text-muted-foreground">
                    Supported formats: CSV, Excel (.xlsx, .xls)
                  </p>
                </div>

                {selectedFile && (
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium">Selected file:</p>
                    <p className="text-sm text-muted-foreground">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Size: {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                )}

                <Button 
                  onClick={handleUploadSubmit}
                  disabled={!selectedFile || isUploading}
                  className="w-full"
                >
                  {isUploading ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Employee Data
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Template & Guidelines
                </CardTitle>
                <CardDescription>
                  Download template and upload instructions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium">Required Columns:</h4>
                    <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1 mt-2">
                      <li>First Name</li>
                      <li>Last Name</li>
                      <li>Email Address</li>
                      <li>Department</li>
                      <li>Job Title</li>
                      <li>Employee ID</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium">Guidelines:</h4>
                    <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1 mt-2">
                      <li>Ensure all email addresses are unique</li>
                      <li>Employee IDs must be unique</li>
                      <li>Maximum file size: 10MB</li>
                      <li>Maximum 5,000 employees per upload</li>
                    </ul>
                  </div>
                </div>

                <Button onClick={downloadTemplate} variant="outline" className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Download CSV Template
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}