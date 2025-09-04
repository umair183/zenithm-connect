import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, CheckCircle, Clock, FileText, User, Bell, DollarSign } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLeaveApplications } from '@/hooks/useLeaveApplications';
import { useTasks } from '@/hooks/useTasks';
import { useNotifications } from '@/hooks/useNotifications';
import { LeaveApplicationForm } from '@/components/LeaveApplicationForm';
import { TaskUpdateForm } from '@/components/TaskUpdateForm';
import { AttendanceTracker } from '@/components/AttendanceTracker';
import { PayrollViewer } from '@/components/PayrollViewer';

const EmployeePortal = () => {
  const { user, userProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const { data: leaveApplications = [] } = useLeaveApplications();
  const { data: tasks = [] } = useTasks();
  const { data: notifications = [] } = useNotifications();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  if (!user || userProfile?.role !== 'employee') {
    return null;
  }

  const unreadNotifications = notifications.filter(n => !n.read);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Employee Portal</h1>
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
                <FileText className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Leave Applications</p>
                  <p className="text-2xl font-bold text-gray-900">{leaveApplications.length}</p>
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
                  <p className="text-2xl font-bold text-gray-900">
                    {tasks.filter(t => t.status !== 'completed').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {leaveApplications.filter(la => la.status === 'pending').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Bell className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Notifications</p>
                  <p className="text-2xl font-bold text-gray-900">{unreadNotifications.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Attendance Tracker */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Attendance Tracker
              </CardTitle>
              <CardDescription>Clock in/out and view your attendance</CardDescription>
            </CardHeader>
            <CardContent>
              <AttendanceTracker />
            </CardContent>
          </Card>

          {/* Payroll */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                My Payroll
              </CardTitle>
              <CardDescription>View your salary slips</CardDescription>
            </CardHeader>
            <CardContent>
              <PayrollViewer />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Leave Applications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Leave Applications
              </CardTitle>
              <CardDescription>Apply for leave and track your applications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <LeaveApplicationForm />
                
                <div className="space-y-3">
                  <h4 className="font-medium">Recent Applications</h4>
                  {leaveApplications.slice(0, 3).map((application) => (
                    <div key={application.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium capitalize">{application.leave_type}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(application.start_date).toLocaleDateString()} - {' '}
                            {new Date(application.end_date).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant={
                          application.status === 'approved' ? 'default' :
                          application.status === 'rejected' ? 'destructive' :
                          'secondary'
                        }>
                          {application.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                My Tasks
              </CardTitle>
              <CardDescription>View and update your assigned tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tasks.slice(0, 4).map((task) => (
                  <div key={task.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{task.title}</h4>
                      <Badge variant={
                        task.status === 'completed' ? 'default' :
                        task.status === 'in_progress' ? 'secondary' :
                        'outline'
                      }>
                        {task.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                    {task.due_date && (
                      <p className="text-xs text-gray-500">
                        Due: {new Date(task.due_date).toLocaleDateString()}
                      </p>
                    )}
                    <div className="mt-2">
                      <TaskUpdateForm task={task} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notifications */}
        {unreadNotifications.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Recent Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {unreadNotifications.slice(0, 5).map((notification) => (
                  <div key={notification.id} className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                    <h4 className="font-medium">{notification.title}</h4>
                    <p className="text-sm text-gray-600">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(notification.created_at).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default EmployeePortal;