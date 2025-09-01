import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export const useAttendance = () => {
  const { userProfile } = useAuth();
  
  return useQuery({
    queryKey: ['attendance'],
    queryFn: async () => {
      let query = supabase
        .from('attendance')
        .select('*');
      
      // If user is not HR, only show their attendance
      if (userProfile?.role !== 'hr') {
        query = query.eq('employee_id', userProfile?.user_id);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!userProfile,
  });
};

export const useClockIn = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { userProfile } = useAuth();

  return useMutation({
    mutationFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      
      // Check if already clocked in today
      const { data: existing } = await supabase
        .from('attendance')
        .select('*')
        .eq('employee_id', userProfile?.user_id)
        .eq('date', today)
        .is('clock_out', null)
        .single();
      
      if (existing) {
        throw new Error('You are already clocked in today');
      }
      
      const { data, error } = await supabase
        .from('attendance')
        .insert({
          employee_id: userProfile?.user_id,
          date: today
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      toast({
        title: "Success",
        description: "Clocked in successfully",
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

export const useClockOut = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { userProfile } = useAuth();

  return useMutation({
    mutationFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      
      // Find today's attendance record
      const { data: attendance, error: findError } = await supabase
        .from('attendance')
        .select('*')
        .eq('employee_id', userProfile?.user_id)
        .eq('date', today)
        .is('clock_out', null)
        .single();
      
      if (findError || !attendance) {
        throw new Error('No active clock-in found for today');
      }
      
      const { data, error } = await supabase
        .from('attendance')
        .update({ clock_out: new Date().toISOString() })
        .eq('id', attendance.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      toast({
        title: "Success",
        description: "Clocked out successfully",
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

export const useTodayAttendance = () => {
  const { userProfile } = useAuth();
  const today = new Date().toISOString().split('T')[0];
  
  return useQuery({
    queryKey: ['today-attendance', today],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('employee_id', userProfile?.user_id)
        .eq('date', today)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!userProfile?.user_id,
  });
};