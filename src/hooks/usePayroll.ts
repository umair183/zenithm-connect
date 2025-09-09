import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export const usePayroll = () => {
  const { userProfile } = useAuth();
  
  return useQuery({
    queryKey: ['payroll'],
    queryFn: async () => {
      let query = supabase
        .from('payroll')
        .select('*');
      
      // If user is not HR, only show their payroll
      if (userProfile?.role !== 'hr') {
        query = query.eq('employee_id', userProfile?.user_id);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Fetch employee names separately
      if (data && data.length > 0) {
        const employeeIds = [...new Set(data.map(p => p.employee_id))];
        const { data: profiles } = await supabase
          .from('profiles')
          .select('user_id, full_name, email')
          .in('user_id', employeeIds);
        
        return data.map(payroll => ({
          ...payroll,
          employee_name: profiles?.find(p => p.user_id === payroll.employee_id)?.full_name || 'Unknown'
        }));
      }
      
      return data;
    },
    enabled: !!userProfile,
  });
};

export const useGeneratePayroll = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (payrollData: {
      employee_id: string;
      month: number;
      year: number;
      base_salary: number;
      deductions: number;
      bonuses: number;
      working_days: number;
      present_days: number;
      late_days: number;
    }) => {
      const net_pay = payrollData.base_salary + payrollData.bonuses - payrollData.deductions;
      
      const { data, error } = await supabase
        .from('payroll')
        .upsert({
          ...payrollData,
          net_pay,
          generated_by: (await supabase.auth.getUser()).data.user?.id,
        })
        .select()
        .single();

      if (error) throw error;
      
      // Create notification for employee
      await supabase.rpc('create_notification', {
        recipient_id: payrollData.employee_id,
        notification_title: 'Payroll Generated',
        notification_message: `Your salary slip for ${payrollData.month}/${payrollData.year} has been generated.`,
        notification_type: 'payroll',
      });
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payroll'] });
      toast({
        title: "Success",
        description: "Payroll generated successfully",
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

export const useEmployeePayroll = (employeeId?: string) => {
  return useQuery({
    queryKey: ['employee-payroll', employeeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payroll')
        .select('*')
        .eq('employee_id', employeeId!)
        .order('year', { ascending: false })
        .order('month', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!employeeId,
  });
};

export const useDeletePayroll = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (payrollId: string) => {
      const { error } = await supabase
        .from('payroll')
        .delete()
        .eq('id', payrollId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payroll'] });
      queryClient.invalidateQueries({ queryKey: ['employee-payroll'] });
      toast({
        title: "Success",
        description: "Payroll record deleted successfully",
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