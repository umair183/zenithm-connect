import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useCreateTaskSubmission, useTaskSubmissions } from '@/hooks/useTaskSubmissions';
import { useAuth } from '@/contexts/AuthContext';
import { FileUp, Send, CheckCircle, XCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface TaskSubmissionFormProps {
  task: any;
}

export const TaskSubmissionForm = ({ task }: TaskSubmissionFormProps) => {
  const { userProfile } = useAuth();
  const createSubmission = useCreateTaskSubmission();
  const { data: submissions } = useTaskSubmissions(task.id);
  const [comment, setComment] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const isHR = userProfile?.role === 'hr';
  const mySubmissions = submissions?.filter(s => s.employee_id === userProfile?.user_id) || [];
  const latestSubmission = mySubmissions[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      await createSubmission.mutateAsync({
        task_id: task.id,
        employee_id: userProfile?.user_id,
        comment: comment,
        file_name: file?.name || null,
        // In a real app, you'd upload the file to storage and get the URL
        file_url: file ? `uploads/${file.name}` : null,
      });
      setComment('');
      setFile(null);
    } catch (error) {
      console.error('Error submitting task:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-yellow-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{task.title}</CardTitle>
          <CardDescription>{task.description}</CardDescription>
          <div className="flex items-center space-x-2">
            <Badge variant={task.status === 'completed' ? 'default' : 'secondary'}>
              {task.status}
            </Badge>
            {task.due_date && (
              <Badge variant="outline">
                Due: {format(new Date(task.due_date), 'MMM dd, yyyy')}
              </Badge>
            )}
          </div>
        </CardHeader>
        
        {!isHR && task.status !== 'completed' && (
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="comment">Update / Comment</Label>
                <Textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Provide an update on your progress..."
                  rows={3}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="file">Attach File (Optional)</Label>
                <Input
                  id="file"
                  type="file"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="cursor-pointer"
                />
              </div>
              
              <Button type="submit" disabled={createSubmission.isPending} className="w-full">
                <Send className="h-4 w-4 mr-2" />
                Submit Update
              </Button>
            </form>
          </CardContent>
        )}
      </Card>

      {/* Submission History */}
      <Card>
        <CardHeader>
          <CardTitle>Submission History</CardTitle>
          <CardDescription>
            {isHR ? 'All submissions for this task' : 'Your submission history'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(isHR ? submissions : mySubmissions)?.map((submission) => (
              <div key={submission.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-medium flex items-center space-x-2">
                      {isHR && (
                        <span>Employee: {submission.employee_id}</span>
                      )}
                      <Badge 
                        className={`${getStatusColor(submission.approval_status)} text-white`}
                      >
                        {getStatusIcon(submission.approval_status)}
                        <span className="ml-1">{submission.approval_status}</span>
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(submission.submitted_at), 'MMM dd, yyyy HH:mm')}
                    </div>
                  </div>
                  {submission.file_name && (
                    <Badge variant="outline" className="flex items-center">
                      <FileUp className="h-3 w-3 mr-1" />
                      {submission.file_name}
                    </Badge>
                  )}
                </div>
                
                <div className="text-sm mb-2">{submission.comment}</div>
                
                {submission.hr_feedback && (
                  <div className="bg-secondary p-3 rounded-md">
                    <div className="font-medium text-sm">HR Feedback:</div>
                    <div className="text-sm">{submission.hr_feedback}</div>
                    {submission.approved_by && (
                      <div className="text-xs text-muted-foreground mt-1">
                        - Approved by: {submission.approved_by}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            
            {(!submissions || submissions.length === 0) && (
              <div className="text-center py-8 text-muted-foreground">
                No submissions yet
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};