import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export const useSurveys = () => {
  const { userProfile } = useAuth();
  
  return useQuery({
    queryKey: ['surveys'],
    queryFn: async () => {
      let query = supabase
        .from('surveys')
        .select(`
          *,
          creator:profiles!surveys_created_by_fkey(full_name)
        `);
      
      if (userProfile?.role !== 'hr') {
        query = query.eq('status', 'active');
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!userProfile,
  });
};

export const useCreateSurvey = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (survey: any) => {
      const { data, error } = await supabase
        .from('surveys')
        .insert({
          ...survey,
          created_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['surveys'] });
      toast({
        title: "Success",
        description: "Survey created successfully",
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

export const useSurveyResponses = (surveyId?: string) => {
  return useQuery({
    queryKey: ['survey-responses', surveyId],
    queryFn: async () => {
      let query = supabase
        .from('survey_responses')
        .select(`
          *,
          survey:surveys(title),
          employee:profiles(full_name, email)
        `);
      
      if (surveyId) {
        query = query.eq('survey_id', surveyId);
      }
      
      const { data, error } = await query.order('submitted_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useSubmitSurveyResponse = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ surveyId, responses, isAnonymous }: { 
      surveyId: string; 
      responses: any; 
      isAnonymous: boolean;
    }) => {
      const userId = isAnonymous ? null : (await supabase.auth.getUser()).data.user?.id;
      
      const { data, error } = await supabase
        .from('survey_responses')
        .insert({
          survey_id: surveyId,
          employee_id: userId,
          responses
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['survey-responses'] });
      toast({
        title: "Success",
        description: "Survey response submitted successfully",
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