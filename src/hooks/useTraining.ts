import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export const useTrainingPrograms = () => {
  return useQuery({
    queryKey: ['training-programs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('training_programs')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useCreateTrainingProgram = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (program: any) => {
      const { data, error } = await supabase
        .from('training_programs')
        .insert({
          ...program,
          created_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['training-programs'] });
      toast({
        title: "Success",
        description: "Training program created successfully",
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

export const useTrainingEnrollments = (employeeId?: string) => {
  const { userProfile } = useAuth();
  
  return useQuery({
    queryKey: ['training-enrollments', employeeId],
    queryFn: async () => {
      let query = supabase
        .from('training_enrollments')
        .select(`
          *,
          training_program:training_programs(title, start_date, end_date, trainer_name),
          employee:profiles!training_enrollments_employee_id_fkey(full_name, email)
        `);
      
      if (userProfile?.role !== 'hr' && employeeId) {
        query = query.eq('employee_id', employeeId);
      } else if (userProfile?.role !== 'hr') {
        query = query.eq('employee_id', userProfile?.user_id);
      }
      
      const { data, error } = await query.order('enrolled_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!userProfile,
  });
};

export const useEnrollInTraining = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ trainingProgramId, employeeId }: { trainingProgramId: string; employeeId?: string }) => {
      const userId = employeeId || (await supabase.auth.getUser()).data.user?.id;
      
      const { data, error } = await supabase
        .from('training_enrollments')
        .insert({
          training_program_id: trainingProgramId,
          employee_id: userId
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['training-enrollments'] });
      toast({
        title: "Success",
        description: "Enrolled in training program successfully",
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

export const useUpdateTrainingEnrollment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { data, error } = await supabase
        .from('training_enrollments')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['training-enrollments'] });
      toast({
        title: "Success",
        description: "Training enrollment updated successfully",
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