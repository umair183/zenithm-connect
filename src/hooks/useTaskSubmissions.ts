import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export const useTaskSubmissions = (taskId?: string) => {
  const { userProfile } = useAuth();
  
  return useQuery({
    queryKey: ['task-submissions', taskId],
    queryFn: async () => {
      let query = supabase
        .from('task_submissions')
        .select('*');
      
      if (taskId) {
        query = query.eq('task_id', taskId);
      }
      
      // If user is not HR, only show their submissions
      if (userProfile?.role !== 'hr') {
        query = query.eq('employee_id', userProfile?.user_id);
      }
      
      const { data, error } = await query.order('submitted_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!userProfile,
  });
};

export const useCreateTaskSubmission = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (submission: any) => {
      const { data, error } = await supabase
        .from('task_submissions')
        .insert(submission)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task-submissions'] });
      toast({
        title: "Success",
        description: "Task submission created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateTaskSubmission = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { data, error } = await supabase
        .from('task_submissions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task-submissions'] });
      toast({
        title: "Success",
        description: "Task submission updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};