import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Users, Calendar, Clock, FileText, CheckCircle, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfiles } from '@/hooks/useProfiles';
import { useLeaveApplications } from '@/hooks/useLeaveApplications';
import { useTasks } from '@/hooks/useTasks';
import { TaskAssignmentForm } from '@/components/TaskAssignmentForm';
import { LeaveApprovalForm } from '@/components/LeaveApprovalForm';
import { PayrollGenerator } from '@/components/PayrollGenerator';
import { AttendanceManagement } from '@/components/AttendanceManagement';
import EmployeeManagement from '@/components/EmployeeManagement';

const HRPortal = () => {
  const { user, userProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const { data: profiles = [] } = useProfiles();
  const { data: leaveApplications = [] } = useLeaveApplications();
  const { data: tasks = [] } = useTasks();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  if (!user || userProfile?.role !== 'hr') {
    return null;
  }

  const employees = profiles.filter(p => p.role === 'employee');
  const pendingApplications = leaveApplications.filter(la => la.status === 'pending');
  const activeTasks = tasks.filter(t => t.status !== 'completed');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">HR Portal</h1>
            <p className="text-gray-600">Welcome back, {userProfile?.full_name}</p>
          </div>
          <Button onClick={signOut} variant="outline">
            Sign Out
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Employees</p>
                  <p className="text-2xl font-bold text-gray-900">{employees.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Applications</p>
                  <p className="text-2xl font-bold text-gray-900">{pendingApplications.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Tasks</p>
                  <p className="text-2xl font-bold text-gray-900">{activeTasks.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Applications</p>
                  <p className="text-2xl font-bold text-gray-900">{leaveApplications.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Management Modules */}
        <div className="space-y-8">
          {/* Attendance Management Module */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Attendance Management
              </CardTitle>
              <CardDescription>Monitor and manage employee attendance in real-time</CardDescription>
            </CardHeader>
            <CardContent>
              <AttendanceManagement employees={employees} />
            </CardContent>
          </Card>

          {/* Payroll Management Module */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Payroll Management
              </CardTitle>
              <CardDescription>Generate and manage employee payroll with attendance integration</CardDescription>
            </CardHeader>
            <CardContent>
              <PayrollGenerator employees={employees} />
            </CardContent>
          </Card>

          {/* Employee Management Module */}
          <EmployeeManagement />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Task Assignment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Task Management
                </CardTitle>
                <CardDescription>Assign and manage employee tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <TaskAssignmentForm employees={employees} />
                  
                  <div className="space-y-3">
                    <h4 className="font-medium">Recent Tasks</h4>
                    {tasks.slice(0, 3).map((task) => (
                      <div key={task.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{task.title}</p>
                            <p className="text-sm text-gray-600">
                              Assigned to: {task.assigned_profile?.full_name}
                            </p>
                            {task.due_date && (
                              <p className="text-xs text-gray-500">
                                Due: {new Date(task.due_date).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                          <Badge variant={
                            task.status === 'completed' ? 'default' :
                            task.status === 'in_progress' ? 'secondary' :
                            'outline'
                          }>
                            {task.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Leave Approval */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Leave Applications
                </CardTitle>
                <CardDescription>Review and approve employee leave requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pendingApplications.length > 0 ? (
                    pendingApplications.slice(0, 4).map((application) => (
                      <div key={application.id} className="p-3 bg-yellow-50 rounded-lg border">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="font-medium">{application.profiles?.full_name}</p>
                            <p className="text-sm text-gray-600 capitalize">
                              {application.leave_type} Leave
                            </p>
                            <p className="text-sm text-gray-600">
                              {new Date(application.start_date).toLocaleDateString()} - {' '}
                              {new Date(application.end_date).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">{application.reason}</p>
                          </div>
                          <Badge variant="secondary">Pending</Badge>
                        </div>
                        <LeaveApprovalForm application={application} />
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No pending applications</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Employee Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {employees.map((employee) => (
                <div key={employee.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">
                        {employee.full_name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{employee.full_name}</h4>
                      <p className="text-sm text-gray-600">{employee.email}</p>
                      {employee.department && (
                        <p className="text-xs text-gray-500">{employee.department}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HRPortal;