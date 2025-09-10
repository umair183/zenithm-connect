import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export const useJobPostings = () => {
  const { userProfile } = useAuth();
  
  return useQuery({
    queryKey: ['job-postings'],
    queryFn: async () => {
      let query = supabase.from('job_postings').select('*');
      
      if (userProfile?.role !== 'hr') {
        query = query.eq('status', 'active');
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useCreateJobPosting = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (jobPosting: any) => {
      const { data, error } = await supabase
        .from('job_postings')
        .insert({
          ...jobPosting,
          posted_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-postings'] });
      toast({
        title: "Success",
        description: "Job posting created successfully",
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

export const useJobApplications = (jobPostingId?: string) => {
  return useQuery({
    queryKey: ['job-applications', jobPostingId],
    queryFn: async () => {
      let query = supabase
        .from('job_applications')
        .select(`
          *,
          job_posting:job_postings(title, department)
        `);
      
      if (jobPostingId) {
        query = query.eq('job_posting_id', jobPostingId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useSubmitJobApplication = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (application: any) => {
      const { data, error } = await supabase
        .from('job_applications')
        .insert(application)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-applications'] });
      toast({
        title: "Success",
        description: "Application submitted successfully",
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

export const useUpdateJobApplication = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { data, error } = await supabase
        .from('job_applications')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-applications'] });
      toast({
        title: "Success",
        description: "Application updated successfully",
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