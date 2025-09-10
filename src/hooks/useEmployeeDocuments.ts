import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export const useEmployeeDocuments = (employeeId?: string) => {
  const { userProfile } = useAuth();
  
  return useQuery({
    queryKey: ['employee-documents', employeeId],
    queryFn: async () => {
      let query = supabase.from('employee_documents').select('*');
      
      if (userProfile?.role !== 'hr' && employeeId) {
        query = query.eq('employee_id', employeeId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!userProfile,
  });
};

export const useUploadDocument = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ 
      file, 
      employeeId, 
      documentType, 
      documentName 
    }: { 
      file: File; 
      employeeId: string; 
      documentType: string; 
      documentName: string;
    }) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${employeeId}/${documentType}_${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('employee-documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data, error } = await supabase
        .from('employee_documents')
        .insert({
          employee_id: employeeId,
          document_type: documentType,
          document_name: documentName,
          file_path: fileName,
          file_size: file.size,
          uploaded_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee-documents'] });
      toast({
        title: "Success",
        description: "Document uploaded successfully",
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

export const useDeleteDocument = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (documentId: string) => {
      // First get the document to find the file path
      const { data: document, error: fetchError } = await supabase
        .from('employee_documents')
        .select('file_path')
        .eq('id', documentId)
        .single();
      
      if (fetchError) throw fetchError;

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('employee-documents')
        .remove([document.file_path]);

      if (storageError) throw storageError;

      // Delete from database
      const { error } = await supabase
        .from('employee_documents')
        .delete()
        .eq('id', documentId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee-documents'] });
      toast({
        title: "Success",
        description: "Document deleted successfully",
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