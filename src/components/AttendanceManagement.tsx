import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, Filter } from 'lucide-react';
import { useAttendance } from '@/hooks/useAttendance';
import { format, startOfMonth, endOfMonth } from 'date-fns';

interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  department?: string;
}

interface AttendanceManagementProps {
  employees?: Profile[];
}

export const AttendanceManagement = ({ employees = [] }: AttendanceManagementProps) => {
  const [filterEmployee, setFilterEmployee] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [dateRange, setDateRange] = useState('this-month');
  const { data: attendance } = useAttendance();

  const departments = [...new Set(employees.map(e => e.department).filter(Boolean))] as string[];
  
  const getFilteredAttendance = () => {
    if (!attendance) return [];
    
    let filtered = attendance;
    
    // Filter by employee
    if (filterEmployee !== 'all') {
      filtered = filtered.filter(a => a.employee_id === filterEmployee);
    }
    
    // Filter by department
    if (filterDepartment !== 'all') {
      const departmentEmployees = employees.filter(e => e.department === filterDepartment);
      filtered = filtered.filter(a => 
        departmentEmployees.some(e => e.user_id === a.employee_id)
      );
    }
    
    // Filter by date range
    const now = new Date();
    switch (dateRange) {
      case 'today':
        filtered = filtered.filter(a => 
          format(new Date(a.date), 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd')
        );
        break;
      case 'this-week':
        const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
        filtered = filtered.filter(a => new Date(a.date) >= weekStart);
        break;
      case 'this-month':
        filtered = filtered.filter(a => 
          new Date(a.date) >= startOfMonth(now) && 
          new Date(a.date) <= endOfMonth(now)
        );
        break;
    }
    
    return filtered;
  };

  const filteredAttendance = getFilteredAttendance();

  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find(e => e.user_id === employeeId);
    return employee?.full_name || 'Unknown Employee';
  };

  const calculateTotalHours = (clockIn: string, clockOut?: string) => {
    if (!clockOut) return 0;
    const start = new Date(clockIn);
    const end = new Date(clockOut);
    return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60) * 100) / 100;
  };

  const getAttendanceStats = () => {
    const totalRecords = filteredAttendance.length;
    const presentToday = filteredAttendance.filter(a => 
      format(new Date(a.date), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') &&
      a.clock_in
    ).length;
    const averageHours = filteredAttendance.reduce((acc, a) => 
      acc + (a.total_hours || 0), 0
    ) / Math.max(totalRecords, 1);
    
    return { totalRecords, presentToday, averageHours };
  };

  const stats = getAttendanceStats();

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Records</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalRecords}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Present Today</p>
                <p className="text-2xl font-bold text-gray-900">{stats.presentToday}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Avg Hours</p>
                <p className="text-2xl font-bold text-gray-900">{stats.averageHours.toFixed(1)}h</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Attendance Management
          </CardTitle>
          <CardDescription>View and manage employee attendance records</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <Label htmlFor="employee-filter">Filter by Employee</Label>
              <Select value={filterEmployee} onValueChange={setFilterEmployee}>
                <SelectTrigger>
                  <SelectValue placeholder="All Employees" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Employees</SelectItem>
                  {employees.map((employee) => (
                    <SelectItem key={employee.user_id} value={employee.user_id}>
                      {employee.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {departments.length > 0 && (
              <div>
                <Label htmlFor="department-filter">Filter by Department</Label>
                <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Departments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label htmlFor="date-filter">Date Range</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="this-week">This Week</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Attendance Records */}
          <div className="space-y-4">
            {filteredAttendance.map((record) => {
              const totalHours = calculateTotalHours(record.clock_in, record.clock_out || undefined);
              const isLate = new Date(record.clock_in).getHours() > 9;
              
              return (
                <div key={record.id} className="flex justify-between items-center p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">
                      {getEmployeeName(record.employee_id)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(record.date), 'MMM dd, yyyy')}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      In: {format(new Date(record.clock_in), 'HH:mm')}
                      {record.clock_out && ` | Out: ${format(new Date(record.clock_out), 'HH:mm')}`}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {isLate && <Badge variant="destructive">Late</Badge>}
                    <Badge variant={record.clock_out ? "secondary" : "default"}>
                      {record.clock_out ? "Completed" : "In Progress"}
                    </Badge>
                    {totalHours > 0 && (
                      <div className="text-sm font-medium">
                        {totalHours}h
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            
            {filteredAttendance.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No attendance records found for the selected filters
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};