import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useProfiles } from '@/hooks/useProfiles';
import { useTasks } from '@/hooks/useTasks';
import { useLeaveApplications } from '@/hooks/useLeaveApplications';
import { useAttendance } from '@/hooks/useAttendance';
import { BarChart3, Users, CheckCircle, Calendar, Clock } from 'lucide-react';
import { format, subDays, isAfter } from 'date-fns';

export const PerformanceDashboard = () => {
  const { data: profiles } = useProfiles();
  const { data: tasks } = useTasks();
  const { data: leaveApplications } = useLeaveApplications();
  const { data: attendance } = useAttendance();

  const employees = profiles?.filter(p => p.role === 'employee') || [];
  const thirtyDaysAgo = subDays(new Date(), 30);

  // Calculate performance metrics for each employee
  const employeeMetrics = employees.map(employee => {
    const employeeTasks = tasks?.filter(t => t.assigned_to === employee.user_id) || [];
    const completedTasks = employeeTasks.filter(t => t.status === 'completed');
    const employeeLeave = leaveApplications?.filter(l => l.employee_id === employee.user_id) || [];
    const employeeAttendance = attendance?.filter(a => a.employee_id === employee.user_id) || [];
    const recentAttendance = employeeAttendance.filter(a => 
      isAfter(new Date(a.date), thirtyDaysAgo)
    );

    const completionRate = employeeTasks.length > 0 ? 
      (completedTasks.length / employeeTasks.length) * 100 : 0;
    
    const totalHours = recentAttendance.reduce((sum, a) => sum + (a.total_hours || 0), 0);
    const avgDailyHours = recentAttendance.length > 0 ? totalHours / recentAttendance.length : 0;

    return {
      ...employee,
      totalTasks: employeeTasks.length,
      completedTasks: completedTasks.length,
      completionRate,
      leaveRequests: employeeLeave.length,
      attendanceDays: recentAttendance.length,
      avgDailyHours,
      totalHours
    };
  });

  // Sort by completion rate
  const sortedEmployees = employeeMetrics.sort((a, b) => b.completionRate - a.completionRate);

  // Overall stats
  const totalTasks = tasks?.length || 0;
  const completedTasks = tasks?.filter(t => t.status === 'completed').length || 0;
  const overallCompletionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Total Employees
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employees.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              Tasks Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTasks}</div>
            <div className="text-sm text-muted-foreground">
              {overallCompletionRate.toFixed(1)}% completion rate
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Leave Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leaveApplications?.length || 0}</div>
            <div className="text-sm text-muted-foreground">
              {leaveApplications?.filter(l => l.status === 'pending').length || 0} pending
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Avg Daily Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {employeeMetrics.length > 0 ? 
                (employeeMetrics.reduce((sum, e) => sum + e.avgDailyHours, 0) / employeeMetrics.length).toFixed(1) : 
                '0'
              }h
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Employee Performance Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Employee Performance (Last 30 Days)
          </CardTitle>
          <CardDescription>
            Task completion rates and attendance metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedEmployees.map((employee) => (
              <div key={employee.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-medium">{employee.full_name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {employee.department || 'No Department'} • {employee.job_title || 'Employee'}
                    </p>
                  </div>
                  <Badge variant={employee.completionRate >= 80 ? "default" : 
                                employee.completionRate >= 60 ? "secondary" : "destructive"}>
                    {employee.completionRate.toFixed(0)}% Complete
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-semibold">{employee.completedTasks}</div>
                    <div className="text-sm text-muted-foreground">Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold">{employee.totalTasks}</div>
                    <div className="text-sm text-muted-foreground">Total Tasks</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold">{employee.attendanceDays}</div>
                    <div className="text-sm text-muted-foreground">Days Present</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold">{employee.avgDailyHours.toFixed(1)}h</div>
                    <div className="text-sm text-muted-foreground">Avg Daily</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Task Completion Rate</span>
                    <span>{employee.completionRate.toFixed(1)}%</span>
                  </div>
                  <Progress value={employee.completionRate} className="h-2" />
                </div>
              </div>
            ))}
            
            {employees.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No employees found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};