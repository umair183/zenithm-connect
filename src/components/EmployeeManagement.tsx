import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Users, UserCheck, UserX, Trash2 } from 'lucide-react';
import { useEmployees, useUpdateEmployeeStatus, useDeleteEmployee } from '@/hooks/useEmployeeManagement';
import { format } from 'date-fns';

const EmployeeManagement = () => {
  const { data: employees, isLoading } = useEmployees();
  const updateEmployeeStatus = useUpdateEmployeeStatus();
  const deleteEmployee = useDeleteEmployee();

  const activeEmployees = employees?.filter(emp => emp.status === 'active') || [];
  const bannedEmployees = employees?.filter(emp => emp.status === 'banned') || [];

  const handleStatusChange = (employeeId: string, status: 'active' | 'banned') => {
    updateEmployeeStatus.mutate({ employeeId, status });
  };

  const handleDeleteEmployee = (employeeId: string) => {
    deleteEmployee.mutate(employeeId);
  };

  if (isLoading) {
    return <div>Loading employees...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Employee Management
          </CardTitle>
          <CardDescription>
            Manage employee status and access permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-primary/5 rounded-lg">
              <div className="text-2xl font-bold text-primary">{employees?.length || 0}</div>
              <div className="text-sm text-muted-foreground">Total Employees</div>
            </div>
            <div className="text-center p-4 bg-green-500/5 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{activeEmployees.length}</div>
              <div className="text-sm text-muted-foreground">Active</div>
            </div>
            <div className="text-center p-4 bg-red-500/5 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{bannedEmployees.length}</div>
              <div className="text-sm text-muted-foreground">Banned</div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">All Employees</h3>
            {employees?.map((employee) => (
              <div key={employee.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={employee.avatar_url || ''} />
                    <AvatarFallback>
                      {employee.full_name?.charAt(0) || 'E'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{employee.full_name}</div>
                    <div className="text-sm text-muted-foreground">{employee.email}</div>
                    <div className="text-sm text-muted-foreground">
                      {employee.job_title} • {employee.department}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Joined: {employee.created_at ? format(new Date(employee.created_at), 'MMM dd, yyyy') : 'N/A'}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge variant={employee.status === 'active' ? 'default' : 'destructive'}>
                    {employee.status === 'active' ? 'Active' : 'Banned'}
                  </Badge>
                  
                  {employee.role !== 'hr' && (
                    <>
                      {employee.status === 'active' ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusChange(employee.user_id, 'banned')}
                          disabled={updateEmployeeStatus.isPending}
                        >
                          <UserX className="h-4 w-4 mr-1" />
                          Ban
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusChange(employee.user_id, 'active')}
                          disabled={updateEmployeeStatus.isPending}
                        >
                          <UserCheck className="h-4 w-4 mr-1" />
                          Activate
                        </Button>
                      )}
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            disabled={deleteEmployee.isPending}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Permanently Delete Employee</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete {employee.full_name}'s 
                              account and remove all their data from the system including attendance records, 
                              payroll history, and task assignments.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteEmployee(employee.user_id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete Permanently
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeManagement;