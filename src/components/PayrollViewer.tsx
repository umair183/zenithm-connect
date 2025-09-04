import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DollarSign, Download, Calendar } from 'lucide-react';
import { usePayroll } from '@/hooks/usePayroll';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';

export const PayrollViewer = () => {
  const { data: payrollRecords } = usePayroll();
  const { userProfile } = useAuth();

  const downloadSalarySlip = (record: any) => {
    // Create a simple text-based salary slip (in a real app, you'd generate a PDF)
    const content = `
SALARY SLIP
${format(new Date(), 'MMMM yyyy')}
--------------------------------
Employee: ${userProfile?.full_name}
Period: ${record.month}/${record.year}

EARNINGS:
Base Salary: $${record.base_salary}
Bonuses: $${record.bonuses}
Total Earnings: $${(record.base_salary + record.bonuses).toFixed(2)}

DEDUCTIONS:
Total Deductions: $${record.deductions}

ATTENDANCE:
Working Days: ${record.working_days}
Present Days: ${record.present_days}
Late Days: ${record.late_days}

NET PAY: $${record.net_pay}
--------------------------------
Generated on: ${format(new Date(record.generated_at), 'MMM dd, yyyy')}
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `salary_slip_${record.month}_${record.year}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="h-5 w-5 mr-2" />
            My Salary Slips
          </CardTitle>
          <CardDescription>View and download your monthly salary slips</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {payrollRecords?.map((record) => (
              <div key={record.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-medium flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {format(new Date(record.year, record.month - 1), 'MMMM yyyy')}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Generated on {format(new Date(record.generated_at), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary">Processed</Badge>
                    <div className="text-lg font-bold text-green-600 mt-1">
                      ${record.net_pay}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">Base Salary</p>
                    <p className="font-medium">${record.base_salary}</p>
                  </div>
                  
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-xs text-green-600">Bonuses</p>
                    <p className="font-medium text-green-600">+${record.bonuses}</p>
                  </div>
                  
                  <div className="p-3 bg-red-50 rounded-lg">
                    <p className="text-xs text-red-600">Deductions</p>
                    <p className="font-medium text-red-600">-${record.deductions}</p>
                  </div>
                  
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-blue-600">Attendance</p>
                    <p className="font-medium text-blue-600">{record.present_days}/{record.working_days}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-3 border-t">
                  <div>
                    <p className="text-sm text-gray-600">
                      Late Days: {record.late_days} | Working Days: {record.working_days}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadSalarySlip(record)}
                    className="flex items-center"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
            
            {(!payrollRecords || payrollRecords.length === 0) && (
              <div className="text-center py-8 text-muted-foreground">
                No salary slips available yet
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};