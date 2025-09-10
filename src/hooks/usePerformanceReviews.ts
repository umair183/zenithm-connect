import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export const usePerformanceReviews = (employeeId?: string) => {
  const { userProfile } = useAuth();
  
  return useQuery({
    queryKey: ['performance-reviews', employeeId],
    queryFn: async () => {
      let query = supabase
        .from('performance_reviews')
        .select(`
          *,
          employee:profiles!performance_reviews_employee_id_fkey(full_name, email),
          reviewer:profiles!performance_reviews_reviewer_id_fkey(full_name, email)
        `);
      
      if (userProfile?.role !== 'hr') {
        query = query.or(`employee_id.eq.${userProfile?.user_id},reviewer_id.eq.${userProfile?.user_id}`);
      } else if (employeeId) {
        query = query.eq('employee_id', employeeId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!userProfile,
  });
};

export const useCreatePerformanceReview = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (review: any) => {
      const { data, error } = await supabase
        .from('performance_reviews')
        .insert(review)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['performance-reviews'] });
      toast({
        title: "Success",
        description: "Performance review created successfully",
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

export const useUpdatePerformanceReview = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { data, error } = await supabase
        .from('performance_reviews')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['performance-reviews'] });
      toast({
        title: "Success",
        description: "Performance review updated successfully",
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