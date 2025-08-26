import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Building2, Plus, Users, TrendingUp, Settings, Upload, Download, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export default function Organizations() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedOrgForEmployees, setSelectedOrgForEmployees] = useState<number | null>(null);

  const mockEmployees: Record<number, Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    department: string;
    jobTitle: string;
    employeeId: string;
    hireDate: string;
    status: 'Active' | 'Inactive';
  }>> = {
    1: [ // Hilton Hotel
      { id: '1', firstName: 'John', lastName: 'Smith', email: 'john.smith@hilton.com', department: 'Front Desk', jobTitle: 'Front Desk Manager', employeeId: 'HH001', hireDate: '2022-03-15', status: 'Active' },
      { id: '2', firstName: 'Sarah', lastName: 'Johnson', email: 'sarah.johnson@hilton.com', department: 'Housekeeping', jobTitle: 'Housekeeping Supervisor', employeeId: 'HH002', hireDate: '2021-08-22', status: 'Active' },
      { id: '3', firstName: 'Michael', lastName: 'Davis', email: 'michael.davis@hilton.com', department: 'Food & Beverage', jobTitle: 'Restaurant Manager', employeeId: 'HH003', hireDate: '2023-01-10', status: 'Active' },
      { id: '4', firstName: 'Emily', lastName: 'Wilson', email: 'emily.wilson@hilton.com', department: 'HR', jobTitle: 'HR Coordinator', employeeId: 'HH004', hireDate: '2022-11-05', status: 'Active' },
      { id: '5', firstName: 'David', lastName: 'Brown', email: 'david.brown@hilton.com', department: 'Maintenance', jobTitle: 'Maintenance Technician', employeeId: 'HH005', hireDate: '2020-06-18', status: 'Active' },
    ],
    2: [ // Tech Corp Inc
      { id: '6', firstName: 'Lisa', lastName: 'Anderson', email: 'lisa.anderson@techcorp.com', department: 'Engineering', jobTitle: 'Senior Developer', employeeId: 'TC001', hireDate: '2021-09-12', status: 'Active' },
      { id: '7', firstName: 'James', lastName: 'Martinez', email: 'james.martinez@techcorp.com', department: 'Marketing', jobTitle: 'Marketing Specialist', employeeId: 'TC002', hireDate: '2022-04-08', status: 'Active' },
      { id: '8', firstName: 'Anna', lastName: 'Garcia', email: 'anna.garcia@techcorp.com', department: 'Design', jobTitle: 'UX Designer', employeeId: 'TC003', hireDate: '2023-02-20', status: 'Active' },
      { id: '9', firstName: 'Robert', lastName: 'Lee', email: 'robert.lee@techcorp.com', department: 'Sales', jobTitle: 'Sales Manager', employeeId: 'TC004', hireDate: '2021-12-03', status: 'Active' },
    ],
    3: [ // Metro Hospital
      { id: '10', firstName: 'Maria', lastName: 'Rodriguez', email: 'maria.rodriguez@metrohospital.com', department: 'Nursing', jobTitle: 'Registered Nurse', employeeId: 'MH001', hireDate: '2020-05-14', status: 'Active' },
      { id: '11', firstName: 'Thomas', lastName: 'White', email: 'thomas.white@metrohospital.com', department: 'Administration', jobTitle: 'Admin Assistant', employeeId: 'MH002', hireDate: '2022-07-30', status: 'Active' },
      { id: '12', firstName: 'Jessica', lastName: 'Taylor', email: 'jessica.taylor@metrohospital.com', department: 'Laboratory', jobTitle: 'Lab Technician', employeeId: 'MH003', hireDate: '2021-10-11', status: 'Active' },
    ]
  };

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

  // Filter organizations based on user role
  const isHRManager = user?.profile?.role === 'HR Manager';
  const userOrganization = user?.profile?.organization;
  
  const filteredOrganizations = isHRManager 
    ? mockOrganizations.filter(org => org.name === userOrganization)
    : mockOrganizations;

  const canManageAllOrganizations = user?.profile?.role === 'Super Admin' || user?.profile?.role === 'Manager';

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
          <h1 className="text-3xl font-bold tracking-tight">
            {isHRManager ? 'My Organization' : 'Organizations'}
          </h1>
          <p className="text-muted-foreground">
            {isHRManager 
              ? `Manage ${userOrganization} employees and healthcare plans.`
              : 'Manage corporate clients and their healthcare plans.'
            }
          </p>
        </div>
        {canManageAllOrganizations && (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Organization
          </Button>
        )}
      </div>

      <Tabs defaultValue="directory" className="space-y-6">
        <TabsList>
          <TabsTrigger value="directory">
            {isHRManager ? 'Organization Details' : 'Organization Directory'}
          </TabsTrigger>
          <TabsTrigger value="upload">Employee Census Upload</TabsTrigger>
        </TabsList>

        <TabsContent value="directory">
          {selectedOrgForEmployees ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    <CardTitle>
                      {filteredOrganizations.find(org => org.id === selectedOrgForEmployees)?.name} Employees
                    </CardTitle>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedOrgForEmployees(null)}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Organizations
                  </Button>
                </div>
                <CardDescription>
                  Employee directory and information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Job Title</TableHead>
                      <TableHead>Employee ID</TableHead>
                      <TableHead>Hire Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockEmployees[selectedOrgForEmployees]?.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell className="font-medium">
                          {employee.firstName} {employee.lastName}
                        </TableCell>
                        <TableCell>{employee.email}</TableCell>
                        <TableCell>{employee.department}</TableCell>
                        <TableCell>{employee.jobTitle}</TableCell>
                        <TableCell>{employee.employeeId}</TableCell>
                        <TableCell>{employee.hireDate}</TableCell>
                        <TableCell>
                          <Badge variant={employee.status === 'Active' ? 'default' : 'secondary'}>
                            {employee.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  {isHRManager ? 'Organization Details' : 'Organization Directory'}
                </CardTitle>
                <CardDescription>
                  {isHRManager 
                    ? `Details and employee information for ${userOrganization}`
                    : 'Corporate clients and their telemedicine programs'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredOrganizations.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Building2 className="mx-auto h-12 w-12 mb-4 opacity-50" />
                    <p>No organization found matching your profile.</p>
                    <p className="text-sm">Please contact your administrator to update your organization assignment.</p>
                  </div>
                ) : (
                   <div className="space-y-4">
                     {filteredOrganizations.map((org) => (
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
                           <Button 
                             variant="outline" 
                             size="sm"
                             onClick={() => setSelectedOrgForEmployees(org.id)}
                           >
                             <Users className="mr-2 h-4 w-4" />
                             Employees
                           </Button>
                           <Button variant="outline" size="sm">
                             <TrendingUp className="mr-2 h-4 w-4" />
                             Reports
                           </Button>
                           {canManageAllOrganizations && (
                             <Button variant="outline" size="sm">
                               <Settings className="mr-2 h-4 w-4" />
                               Settings
                             </Button>
                           )}
                         </div>
                       </div>
                     ))}
                   </div>
                )}
              </CardContent>
            </Card>
          )}
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
                    {isHRManager && (
                      <span className="block mt-1 text-primary">
                        Upload employees for {userOrganization}
                      </span>
                    )}
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