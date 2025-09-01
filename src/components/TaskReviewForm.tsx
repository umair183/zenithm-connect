import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useUpdateTaskSubmission } from '@/hooks/useTaskSubmissions';
import { CheckCircle, XCircle, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';

interface TaskReviewFormProps {
  submission: any;
}

export const TaskReviewForm = ({ submission }: TaskReviewFormProps) => {
  const updateSubmission = useUpdateTaskSubmission();
  const [feedback, setFeedback] = useState('');
  const [isReviewing, setIsReviewing] = useState(false);

  const handleReview = async (status: 'approved' | 'rejected') => {
    if (!feedback.trim()) return;
    
    try {
      await updateSubmission.mutateAsync({
        id: submission.id,
        updates: {
          approval_status: status,
          hr_feedback: feedback,
          approved_at: new Date().toISOString(),
        }
      });
      setFeedback('');
      setIsReviewing(false);
    } catch (error) {
      console.error('Error reviewing submission:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-yellow-500';
    }
  };

  if (submission.approval_status !== 'pending' && !isReviewing) {
    return (
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">
                Employee: {submission.employee_id} - Task: {submission.task_id}
              </CardTitle>
              <CardDescription>
                Submitted on {format(new Date(submission.submitted_at), 'MMM dd, yyyy HH:mm')}
              </CardDescription>
            </div>
            <Badge className={`${getStatusColor(submission.approval_status)} text-white`}>
              {submission.approval_status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Employee Comment:</h4>
              <p className="text-sm text-muted-foreground">{submission.comment}</p>
            </div>
            
            {submission.file_name && (
              <div>
                <h4 className="font-medium mb-2">Attached File:</h4>
                <Badge variant="outline">{submission.file_name}</Badge>
              </div>
            )}
            
            {submission.hr_feedback && (
              <div className="bg-secondary p-4 rounded-lg">
                <h4 className="font-medium mb-2">Your Feedback:</h4>
                <p className="text-sm">{submission.hr_feedback}</p>
              </div>
            )}
            
            <Button 
              onClick={() => setIsReviewing(true)}
              variant="outline"
              size="sm"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Update Review
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          Employee: {submission.employee_id} - Task: {submission.task_id}
        </CardTitle>
        <CardDescription>
          Submitted on {format(new Date(submission.submitted_at), 'MMM dd, yyyy HH:mm')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Employee Comment:</h4>
            <p className="text-sm text-muted-foreground">{submission.comment}</p>
          </div>
          
          {submission.file_name && (
            <div>
              <h4 className="font-medium mb-2">Attached File:</h4>
              <Badge variant="outline">{submission.file_name}</Badge>
            </div>
          )}
          
          <div>
            <h4 className="font-medium mb-2">Your Feedback:</h4>
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Provide feedback on this submission..."
              rows={3}
            />
          </div>
          
          <div className="flex space-x-2">
            <Button
              onClick={() => handleReview('approved')}
              disabled={!feedback.trim() || updateSubmission.isPending}
              className="flex items-center"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve
            </Button>
            <Button
              onClick={() => handleReview('rejected')}
              disabled={!feedback.trim() || updateSubmission.isPending}
              variant="destructive"
              className="flex items-center"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject
            </Button>
            {isReviewing && (
              <Button
                onClick={() => {
                  setIsReviewing(false);
                  setFeedback('');
                }}
                variant="outline"
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};