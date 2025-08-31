import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUpdateTask } from '@/hooks/useTasks';

interface TaskUpdateFormProps {
  task: any;
}

export const TaskUpdateForm = ({ task }: TaskUpdateFormProps) => {
  const [status, setStatus] = useState(task.status);
  const updateTask = useUpdateTask();

  const handleStatusUpdate = async () => {
    if (status === task.status) return;
    
    const updates: any = { status };
    if (status === 'completed') {
      updates.completed_at = new Date().toISOString();
    }
    
    await updateTask.mutateAsync({
      id: task.id,
      updates,
    });
  };

  return (
    <div className="flex items-center space-x-2">
      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger className="w-[140px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="in_progress">In Progress</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
        </SelectContent>
      </Select>
      
      {status !== task.status && (
        <Button 
          size="sm" 
          onClick={handleStatusUpdate}
          disabled={updateTask.isPending}
        >
          {updateTask.isPending ? 'Updating...' : 'Update'}
        </Button>
      )}
    </div>
  );
};