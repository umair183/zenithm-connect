import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export const useAnnouncements = () => {
  const { userProfile } = useAuth();
  
  return useQuery({
    queryKey: ['announcements'],
    queryFn: async () => {
      let query = supabase
        .from('announcements')
        .select(`
          *,
          publisher:profiles!announcements_published_by_fkey(full_name)
        `);
      
      // Filter based on target audience
      if (userProfile?.role !== 'hr') {
        query = query.or(`target_audience.eq.all,target_audience.eq.employees,and(target_audience.eq.department,target_department.eq.${userProfile?.department})`);
      }
      
      const { data, error } = await query
        .order('is_pinned', { ascending: false })
        .order('published_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!userProfile,
  });
};

export const useCreateAnnouncement = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (announcement: any) => {
      const { data, error } = await supabase
        .from('announcements')
        .insert({
          ...announcement,
          published_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      toast({
        title: "Success",
        description: "Announcement created successfully",
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

export const useUpdateAnnouncement = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { data, error } = await supabase
        .from('announcements')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      toast({
        title: "Success",
        description: "Announcement updated successfully",
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

export const useDeleteAnnouncement = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      toast({
        title: "Success",
        description: "Announcement deleted successfully",
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