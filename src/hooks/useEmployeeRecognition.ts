import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export const useEmployeeRecognitions = (employeeId?: string) => {
  const { userProfile } = useAuth();
  
  return useQuery({
    queryKey: ['employee-recognitions', employeeId],
    queryFn: async () => {
      let query = supabase
        .from('employee_recognitions')
        .select(`
          *,
          employee:profiles!employee_recognitions_employee_id_fkey(full_name, email),
          awarder:profiles!employee_recognitions_awarded_by_fkey(full_name)
        `);
      
      if (userProfile?.role !== 'hr') {
        query = query.or(`employee_id.eq.${userProfile?.user_id},is_public.eq.true`);
      } else if (employeeId) {
        query = query.eq('employee_id', employeeId);
      }
      
      const { data, error } = await query.order('award_date', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!userProfile,
  });
};

export const useCreateRecognition = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (recognition: any) => {
      const { data, error } = await supabase
        .from('employee_recognitions')
        .insert({
          ...recognition,
          awarded_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee-recognitions'] });
      toast({
        title: "Success",
        description: "Recognition created successfully",
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