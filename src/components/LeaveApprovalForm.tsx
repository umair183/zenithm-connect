import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useUpdateLeaveApplication } from '@/hooks/useLeaveApplications';

interface LeaveApprovalFormProps {
  application: any;
}

export const LeaveApprovalForm = ({ application }: LeaveApprovalFormProps) => {
  const [comments, setComments] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { userProfile } = useAuth();
  const updateLeaveApplication = useUpdateLeaveApplication();

  const handleApproval = async (status: 'approved' | 'rejected') => {
    setLoading(true);
    
    await updateLeaveApplication.mutateAsync({
      id: application.id,
      updates: {
        status,
        hr_comments: comments || null,
        approved_by: userProfile?.user_id,
      },
    });
    
    setLoading(false);
    setComments('');
  };

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor="comments">HR Comments (Optional)</Label>
        <Textarea
          id="comments"
          placeholder="Add any comments..."
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          className="min-h-[60px]"
        />
      </div>
      
      <div className="flex space-x-2">
        <Button
          size="sm"
          onClick={() => handleApproval('approved')}
          disabled={loading}
          className="flex-1"
        >
          {loading ? 'Processing...' : 'Approve'}
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={() => handleApproval('rejected')}
          disabled={loading}
          className="flex-1"
        >
          {loading ? 'Processing...' : 'Reject'}
        </Button>
      </div>
    </div>
  );
};