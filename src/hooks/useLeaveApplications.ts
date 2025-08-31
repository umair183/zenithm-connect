import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export const useLeaveApplications = () => {
  const { userProfile } = useAuth();
  
  return useQuery({
    queryKey: ['leave-applications'],
    queryFn: async () => {
      let query = supabase
        .from('leave_applications')
        .select(`
          *,
          profiles!leave_applications_employee_id_fkey(full_name, employee_id),
          hr_profile:profiles!leave_applications_approved_by_fkey(full_name)
        `);
      
      // If user is not HR, only show their own applications
      if (userProfile?.role !== 'hr') {
        query = query.eq('employee_id', userProfile?.user_id);
      }
      
      const { data, error } = await query.order('applied_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!userProfile,
  });
};

export const useCreateLeaveApplication = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (application: any) => {
      const { data, error } = await supabase
        .from('leave_applications')
        .insert(application)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave-applications'] });
      toast({
        title: "Success",
        description: "Leave application submitted successfully",
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

export const useUpdateLeaveApplication = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { data, error } = await supabase
        .from('leave_applications')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave-applications'] });
      toast({
        title: "Success",
        description: "Leave application updated successfully",
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