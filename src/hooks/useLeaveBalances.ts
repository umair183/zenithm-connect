import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export const useLeaveBalances = (employeeId?: string) => {
  const { userProfile } = useAuth();
  
  return useQuery({
    queryKey: ['leave-balances', employeeId],
    queryFn: async () => {
      let query = supabase.from('leave_balances').select('*');
      
      if (userProfile?.role !== 'hr' && employeeId) {
        query = query.eq('employee_id', employeeId);
      } else if (userProfile?.role !== 'hr') {
        query = query.eq('employee_id', userProfile?.user_id);
      }
      
      const { data, error } = await query.order('year', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!userProfile,
  });
};

export const useUpdateLeaveBalance = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ 
      employeeId, 
      leaveType, 
      year, 
      totalDays, 
      usedDays 
    }: { 
      employeeId: string; 
      leaveType: string; 
      year: number; 
      totalDays: number; 
      usedDays: number;
    }) => {
      const remainingDays = totalDays - usedDays;
      
      const { data, error } = await supabase
        .from('leave_balances')
        .upsert({
          employee_id: employeeId,
          leave_type: leaveType as any,
          year,
          total_days: totalDays,
          used_days: usedDays,
          remaining_days: remainingDays
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave-balances'] });
      toast({
        title: "Success",
        description: "Leave balance updated successfully",
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