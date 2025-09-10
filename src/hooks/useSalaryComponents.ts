import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export const useSalaryComponents = (employeeId?: string) => {
  const { userProfile } = useAuth();
  
  return useQuery({
    queryKey: ['salary-components', employeeId],
    queryFn: async () => {
      let query = supabase.from('salary_components').select('*');
      
      if (userProfile?.role !== 'hr' && employeeId) {
        query = query.eq('employee_id', employeeId);
      } else if (userProfile?.role !== 'hr') {
        query = query.eq('employee_id', userProfile?.user_id);
      } else if (employeeId) {
        query = query.eq('employee_id', employeeId);
      }
      
      const { data, error } = await query
        .eq('is_active', true)
        .order('component_type', { ascending: true })
        .order('component_name', { ascending: true });
      
      if (error) throw error;
      return data;
    },
    enabled: !!userProfile,
  });
};

export const useCreateSalaryComponent = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (component: any) => {
      const { data, error } = await supabase
        .from('salary_components')
        .insert(component)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salary-components'] });
      toast({
        title: "Success",
        description: "Salary component created successfully",
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

export const useUpdateSalaryComponent = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { data, error } = await supabase
        .from('salary_components')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salary-components'] });
      toast({
        title: "Success",
        description: "Salary component updated successfully",
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