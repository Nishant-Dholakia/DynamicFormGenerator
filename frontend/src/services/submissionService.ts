import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/client';
import { FormSubmissions } from '../types';

// Fetch all submissions in the system (Admin only)
export const useAllSubmissions = (enabled: boolean = true) => {
  return useQuery<FormSubmissions[]>({
    queryKey: ['submissions', 'all'],
    queryFn: async () => {
      const response = await apiClient.get<FormSubmissions[]>('/submission/all');
      return response.data;
    },
    enabled,
  });
};

// Fetch all submissions for a specific form
export const useFormSubmissions = (formId: string, enabled: boolean = true) => {
  return useQuery<FormSubmissions[]>({
    queryKey: ['submissions', 'form', formId],
    queryFn: async () => {
      const response = await apiClient.get<FormSubmissions[]>(`/submission/form/${formId}`);
      return response.data;
    },
    enabled: enabled && !!formId,
  });
};

// Fetch submission details by ID
export const useSubmissionDetails = (submissionId: string, enabled: boolean = true) => {
  return useQuery<FormSubmissions>({
    queryKey: ['submissions', 'detail', submissionId],
    queryFn: async () => {
      const response = await apiClient.get<FormSubmissions>(`/submission/get/${submissionId}`);
      return response.data;
    },
    enabled: enabled && !!submissionId,
  });
};

// Submit form response mutation
export const useSubmitForm = () => {
  const queryClient = useQueryClient();
  return useMutation<string, Error, FormSubmissions>({
    mutationFn: async (submission) => {
      const response = await apiClient.post<string>('/submission/save', submission);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['submissions', 'form', variables.form.formid] });
      queryClient.invalidateQueries({ queryKey: ['forms'] });
    },
  });
};

// Update submission mutation
export const useUpdateSubmission = () => {
  const queryClient = useQueryClient();
  return useMutation<string, Error, FormSubmissions>({
    mutationFn: async (submission) => {
      const response = await apiClient.put<string>('/submission/update', submission);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
      if (variables.submissionid) {
        queryClient.invalidateQueries({ queryKey: ['submissions', 'detail', variables.submissionid] });
      }
    },
  });
};

// Delete submission mutation
export const useDeleteSubmission = () => {
  const queryClient = useQueryClient();
  return useMutation<string, Error, string>({
    mutationFn: async (submissionId) => {
      const response = await apiClient.delete<string>(`/submission/delete/${submissionId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
    },
  });
};
