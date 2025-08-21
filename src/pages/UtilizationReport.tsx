import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, TrendingDown, Users, Calendar, DollarSign, Activity, Download, Filter } from 'lucide-react';

const utilizationData = [
  { month: 'Jan', consultations: 245, employees: 450, utilization: 54 },
  { month: 'Feb', consultations: 289, employees: 465, utilization: 62 },
  { month: 'Mar', consultations: 312, employees: 470, utilization: 66 },
  { month: 'Apr', consultations: 356, employees: 485, utilization: 73 },
  { month: 'May', consultations: 398, employees: 492, utilization: 81 },
  { month: 'Jun', consultations: 425, employees: 498, utilization: 85 }
];

const serviceTypeData = [
  { name: 'General Consultation', value: 45, color: 'hsl(var(--primary))' },
  { name: 'Mental Health', value: 28, color: 'hsl(var(--secondary))' },
  { name: 'Prescription Refill', value: 15, color: 'hsl(var(--accent))' },
  { name: 'Urgent Care', value: 12, color: 'hsl(var(--muted))' }
];

const departmentData = [
  { department: 'Engineering', employees: 125, consultations: 89, utilization: 71, avgCost: 125 },
  { department: 'Sales', employees: 98, consultations: 73, utilization: 74, avgCost: 118 },
  { department: 'Marketing', employees: 67, consultations: 45, utilization: 67, avgCost: 132 },
  { department: 'HR', employees: 34, consultations: 28, utilization: 82, avgCost: 145 },
  { department: 'Operations', employees: 156, consultations: 112, utilization: 72, avgCost: 119 },
  { department: 'Finance', employees: 45, consultations: 31, utilization: 69, avgCost: 128 }
];

// YTD Data
const ytdData = {
  consultations: 2025,
  employees: 525,
  utilization: 73,
  totalCost: 257175,
  savings: 68500,
  previousYearConsultations: 1820,
  previousYearCost: 235480,
  growth: 11.3
};

// MTD Data (Current month: June)
const mtdData = {
  consultations: 425,
  employees: 498,
  utilization: 85,
  totalCost: 53975,
  savings: 14200,
  previousMonthConsultations: 398,
  previousMonthCost: 50546,
  growth: 6.8
};

const UtilizationReport = () => {
  const totalEmployees = 525;
  const totalConsultations = 1425;
  const overallUtilization = Math.round((totalConsultations / totalEmployees) * 100);
  const avgCostPerConsultation = 127;
  const totalSavings = 45000;

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Utilization Report</h1>
          <p className="text-muted-foreground">
            Employee healthcare utilization analytics and insights
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEmployees}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12 from last month
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Consultations</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalConsultations}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +18% from last month
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilization Rate</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallUtilization}%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +5% from last month
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Healthcare Savings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSavings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +22% from last month
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* YTD and MTD Reports */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Year to Date Report</CardTitle>
            <CardDescription>January - June 2024 performance summary</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Total Consultations</div>
                <div className="text-2xl font-bold">{ytdData.consultations.toLocaleString()}</div>
                <div className="text-xs text-green-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +{ytdData.growth}% vs last year
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Utilization Rate</div>
                <div className="text-2xl font-bold">{ytdData.utilization}%</div>
                <Progress value={ytdData.utilization} className="mt-2" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Total Cost</div>
                <div className="text-2xl font-bold">${ytdData.totalCost.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">
                  vs ${ytdData.previousYearCost.toLocaleString()} last year
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Total Savings</div>
                <div className="text-2xl font-bold text-green-600">${ytdData.savings.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">
                  Cost avoidance & efficiency
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Month to Date Report</CardTitle>
            <CardDescription>June 2024 current month performance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">MTD Consultations</div>
                <div className="text-2xl font-bold">{mtdData.consultations}</div>
                <div className="text-xs text-green-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +{mtdData.growth}% vs last month
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">MTD Utilization</div>
                <div className="text-2xl font-bold">{mtdData.utilization}%</div>
                <Progress value={mtdData.utilization} className="mt-2" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">MTD Cost</div>
                <div className="text-2xl font-bold">${mtdData.totalCost.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">
                  vs ${mtdData.previousMonthCost.toLocaleString()} last month
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">MTD Savings</div>
                <div className="text-2xl font-bold text-green-600">${mtdData.savings.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">
                  Month-over-month improvement
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Utilization Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Utilization Trend</CardTitle>
            <CardDescription>Monthly consultation volume and utilization rate</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={utilizationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="consultations" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  name="Consultations"
                />
                <Line 
                  type="monotone" 
                  dataKey="utilization" 
                  stroke="hsl(var(--secondary))" 
                  strokeWidth={2}
                  name="Utilization %"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Service Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Service Type Distribution</CardTitle>
            <CardDescription>Breakdown of consultation types</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={serviceTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {serviceTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {serviceTypeData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-muted-foreground">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Department Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Department Breakdown</CardTitle>
          <CardDescription>Utilization metrics by department</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department</TableHead>
                <TableHead>Employees</TableHead>
                <TableHead>Consultations</TableHead>
                <TableHead>Utilization Rate</TableHead>
                <TableHead>Avg Cost per Consultation</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departmentData.map((dept) => (
                <TableRow key={dept.department}>
                  <TableCell className="font-medium">{dept.department}</TableCell>
                  <TableCell>{dept.employees}</TableCell>
                  <TableCell>{dept.consultations}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={dept.utilization} className="w-16" />
                      <span className="text-sm">{dept.utilization}%</span>
                    </div>
                  </TableCell>
                  <TableCell>${dept.avgCost}</TableCell>
                  <TableCell>
                    <Badge variant={dept.utilization >= 70 ? "default" : "secondary"}>
                      {dept.utilization >= 70 ? "High" : "Moderate"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Cost Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Cost Analysis</CardTitle>
          <CardDescription>Monthly consultation costs and savings</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={utilizationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value, name) => [
                name === 'consultations' ? value : `$${(Number(value) * avgCostPerConsultation).toLocaleString()}`,
                name === 'consultations' ? 'Consultations' : 'Total Cost'
              ]} />
              <Bar 
                dataKey="consultations" 
                fill="hsl(var(--primary))" 
                name="consultations"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default UtilizationReport;