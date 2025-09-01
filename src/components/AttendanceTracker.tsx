import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useClockIn, useClockOut, useTodayAttendance, useAttendance } from '@/hooks/useAttendance';
import { Clock, LogIn, LogOut, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';

export const AttendanceTracker = () => {
  const { userProfile } = useAuth();
  const clockIn = useClockIn();
  const clockOut = useClockOut();
  const { data: todayAttendance } = useTodayAttendance();
  const { data: attendanceHistory } = useAttendance();

  const isHR = userProfile?.role === 'hr';
  const isClockedIn = todayAttendance && !todayAttendance.clock_out;

  return (
    <div className="space-y-6">
      {!isHR && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Today's Attendance
            </CardTitle>
            <CardDescription>
              {todayAttendance ? 
                `Clocked in at ${format(new Date(todayAttendance.clock_in), 'HH:mm')}` :
                'Not clocked in today'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <Button
                onClick={() => clockIn.mutate()}
                disabled={isClockedIn || clockIn.isPending}
                className="flex items-center"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Clock In
              </Button>
              <Button
                onClick={() => clockOut.mutate()}
                disabled={!isClockedIn || clockOut.isPending}
                variant="outline"
                className="flex items-center"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Clock Out
              </Button>
            </div>
            {todayAttendance && (
              <div className="mt-4 p-4 bg-secondary rounded-lg">
                <div className="flex justify-between items-center">
                  <span>Status:</span>
                  <Badge variant={isClockedIn ? "default" : "secondary"}>
                    {isClockedIn ? "Clocked In" : "Clocked Out"}
                  </Badge>
                </div>
                {todayAttendance.total_hours && (
                  <div className="flex justify-between items-center mt-2">
                    <span>Total Hours:</span>
                    <span className="font-medium">{todayAttendance.total_hours}h</span>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Attendance History
          </CardTitle>
          <CardDescription>
            {isHR ? 'All employee attendance records' : 'Your attendance history'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {attendanceHistory?.map((record) => (
              <div key={record.id} className="flex justify-between items-center p-4 border rounded-lg">
                <div>
                  <div className="font-medium">
                    {format(new Date(record.date), 'MMM dd, yyyy')}
                    {isHR && (
                      <span className="ml-2 text-sm text-muted-foreground">
                        - Employee ID: {record.employee_id}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {format(new Date(record.clock_in), 'HH:mm')} - {
                      record.clock_out ? format(new Date(record.clock_out), 'HH:mm') : 'Present'
                    }
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={record.clock_out ? "secondary" : "default"}>
                    {record.clock_out ? "Completed" : "In Progress"}
                  </Badge>
                  {record.total_hours && (
                    <div className="text-sm font-medium mt-1">
                      {record.total_hours}h
                    </div>
                  )}
                </div>
              </div>
            ))}
            {(!attendanceHistory || attendanceHistory.length === 0) && (
              <div className="text-center py-8 text-muted-foreground">
                No attendance records found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};