import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Users, Calendar, Trash2 } from 'lucide-react';
import { useGeneratePayroll, usePayroll, useDeletePayroll } from '@/hooks/usePayroll';
import { useAttendance } from '@/hooks/useAttendance';
import { useUpdateProfile } from '@/hooks/useProfiles';
import { format } from 'date-fns';

interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  base_salary: number;
}

interface PayrollGeneratorProps {
  employees: Profile[];
}

export const PayrollGenerator = ({ employees }: PayrollGeneratorProps) => {
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [bonuses, setBonuses] = useState(0);
  const [deductions, setDeductions] = useState(0);
  const [editedBaseSalary, setEditedBaseSalary] = useState<number | null>(null);
  
  const generatePayroll = useGeneratePayroll();
  const updateProfile = useUpdateProfile();
  const deletePayroll = useDeletePayroll();
  const { data: payrollRecords } = usePayroll();
  const { data: attendance } = useAttendance();

  const selectedEmployeeData = employees.find(e => e.user_id === selectedEmployee);

  // Update edited base salary when employee changes
  const handleEmployeeChange = (employeeId: string) => {
    setSelectedEmployee(employeeId);
    const employee = employees.find(e => e.user_id === employeeId);
    setEditedBaseSalary(employee?.base_salary || 0);
  };

  const handleUpdateBaseSalary = async () => {
    if (!selectedEmployeeData || editedBaseSalary === null) return;
    
    await updateProfile.mutateAsync({
      id: selectedEmployeeData.id,
      updates: { base_salary: editedBaseSalary }
    });
    
    // Update the local employee data (this will be reflected after query refetch)
    setEditedBaseSalary(null);
  };

  const calculateAttendanceData = () => {
    if (!selectedEmployee || !attendance) return { present_days: 0, late_days: 0 };
    
    const employeeAttendance = attendance.filter(a => 
      a.employee_id === selectedEmployee &&
      new Date(a.date).getMonth() + 1 === month &&
      new Date(a.date).getFullYear() === year
    );
    
    return {
      present_days: employeeAttendance.length,
      late_days: employeeAttendance.filter(a => {
        if (!a.clock_in) return false;
        const clockInTime = new Date(a.clock_in);
        return clockInTime.getHours() > 9; // Assuming 9 AM is the standard start time
      }).length,
    };
  };

  const handleGeneratePayroll = async () => {
    if (!selectedEmployeeData) return;
    
    const attendanceData = calculateAttendanceData();
    const workingDays = 22; // Standard working days per month
    const baseSalary = editedBaseSalary !== null ? editedBaseSalary : (selectedEmployeeData.base_salary || 0);
    
    // Calculate deductions for absent days
    const absentDays = Math.max(0, workingDays - attendanceData.present_days);
    const perDaySalary = baseSalary / workingDays;
    const absenceDeduction = absentDays * perDaySalary;
    
    await generatePayroll.mutateAsync({
      employee_id: selectedEmployee,
      month,
      year,
      base_salary: baseSalary,
      deductions: deductions + absenceDeduction,
      bonuses,
      working_days: workingDays,
      present_days: attendanceData.present_days,
      late_days: attendanceData.late_days,
    });
    
    // Reset form
    setSelectedEmployee('');
    setBonuses(0);
    setDeductions(0);
    setEditedBaseSalary(null);
  };

  const attendanceStats = calculateAttendanceData();
  const currentBaseSalary = editedBaseSalary !== null ? editedBaseSalary : (selectedEmployeeData?.base_salary || 0);
  const netSalary = selectedEmployeeData ? 
    currentBaseSalary + bonuses - deductions - 
    (Math.max(0, 22 - attendanceStats.present_days) * (currentBaseSalary / 22)) : 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="h-5 w-5 mr-2" />
            Generate Payroll
          </CardTitle>
          <CardDescription>Generate salary slips for employees</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="employee">Select Employee</Label>
                <Select value={selectedEmployee} onValueChange={handleEmployeeChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((employee) => (
                      <SelectItem key={employee.user_id} value={employee.user_id}>
                        {employee.full_name} - ${employee.base_salary || 0}/month
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedEmployeeData && (
                <div>
                  <Label htmlFor="baseSalary">Base Salary ($)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="baseSalary"
                      type="number"
                      value={editedBaseSalary || selectedEmployeeData.base_salary || 0}
                      onChange={(e) => setEditedBaseSalary(Number(e.target.value))}
                      min="0"
                      step="0.01"
                    />
                    <Button
                      onClick={handleUpdateBaseSalary}
                      disabled={editedBaseSalary === null || editedBaseSalary === selectedEmployeeData.base_salary || updateProfile.isPending}
                      variant="outline"
                      size="sm"
                    >
                      {updateProfile.isPending ? 'Saving...' : 'Save'}
                    </Button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="month">Month</Label>
                  <Select value={month.toString()} onValueChange={(value) => setMonth(parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => (
                        <SelectItem key={i + 1} value={(i + 1).toString()}>
                          {format(new Date(2024, i, 1), 'MMMM')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="year">Year</Label>
                  <Select value={year.toString()} onValueChange={(value) => setYear(parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 3 }, (_, i) => (
                        <SelectItem key={2024 + i} value={(2024 + i).toString()}>
                          {2024 + i}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bonuses">Bonuses ($)</Label>
                  <Input
                    id="bonuses"
                    type="number"
                    value={bonuses}
                    onChange={(e) => setBonuses(Number(e.target.value))}
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <Label htmlFor="deductions">Additional Deductions ($)</Label>
                  <Input
                    id="deductions"
                    type="number"
                    value={deductions}
                    onChange={(e) => setDeductions(Number(e.target.value))}
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </div>

            {selectedEmployeeData && (
              <div className="space-y-4">
                <div className="p-4 bg-secondary rounded-lg">
                  <h4 className="font-medium mb-2">Payroll Preview</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Base Salary:</span>
                      <span>${currentBaseSalary.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Present Days:</span>
                      <span>{attendanceStats.present_days}/22</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Late Days:</span>
                      <span>{attendanceStats.late_days}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Bonuses:</span>
                      <span>+${bonuses.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Deductions:</span>
                      <span>-${(deductions + Math.max(0, 22 - attendanceStats.present_days) * (currentBaseSalary / 22)).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-medium border-t pt-2">
                      <span>Net Pay:</span>
                      <span>${netSalary.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Button
            onClick={handleGeneratePayroll}
            disabled={!selectedEmployee || generatePayroll.isPending}
            className="mt-4 w-full"
          >
            {generatePayroll.isPending ? 'Generating...' : 'Generate Payroll'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Recent Payroll Records
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {payrollRecords?.slice(0, 5).map((record) => (
              <div key={record.id} className="flex justify-between items-center p-4 border rounded-lg">
                <div>
                  <div className="font-medium">
                    {(record as any).employee_name || 'Employee'} - {record.month}/{record.year}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Base: ${record.base_salary} | Net: ${record.net_pay}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Present: {record.present_days}/22 days
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <Badge variant="secondary">Generated</Badge>
                    <div className="text-sm font-medium mt-1">
                      ${record.net_pay}
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deletePayroll.mutate(record.id)}
                    disabled={deletePayroll.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {(!payrollRecords || payrollRecords.length === 0) && (
              <div className="text-center py-8 text-muted-foreground">
                No payroll records found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};