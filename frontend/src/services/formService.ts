import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/client';
import { FormData, FormDto, User } from '../types';

// Fetch all forms (Admin only)
export const useAllForms = (enabled: boolean = true) => {
  return useQuery<FormData[]>({
    queryKey: ['forms', 'all'],
    queryFn: async () => {
      const response = await apiClient.get<FormData[]>('/form/all');
      return response.data;
    },
    enabled,
  });
};

// Fetch form details by ID
export const useFormDetails = (formId: string, enabled: boolean = true) => {
  return useQuery<FormData>({
    queryKey: ['forms', 'detail', formId],
    queryFn: async () => {
      const response = await apiClient.get<FormData>(`/form/get/${formId}`);
      return response.data;
    },
    enabled: enabled && !!formId,
    retry: false, // Don't retry since a 500 error is thrown for missing form
  });
};

// Fetch user's forms (by User ID)
export const useUserForms = (userId: string | undefined, enabled: boolean = true) => {
  return useQuery<FormData[]>({
    queryKey: ['forms', 'user', userId],
    queryFn: async () => {
      if (!userId) return [];
      const response = await apiClient.get<User>(`/user/get/${userId}`);
      return response.data.forms || [];
    },
    enabled: enabled && !!userId,
  });
};

// Create form mutation
export const useCreateForm = () => {
  const queryClient = useQueryClient();
  return useMutation<FormData, Error, FormDto>({
    mutationFn: async (formDto) => {
      const response = await apiClient.post<FormData>('/form/save', formDto);
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate queries to refresh lists
      queryClient.invalidateQueries({ queryKey: ['forms'] });
    },
  });
};

// Update form mutation
export const useUpdateForm = () => {
  const queryClient = useQueryClient();
  return useMutation<FormData, Error, FormData>({
    mutationFn: async (formData) => {
      const response = await apiClient.put<FormData>('/form/update', formData);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['forms'] });
      queryClient.invalidateQueries({ queryKey: ['forms', 'detail', data.formid] });
    },
  });
};

// Toggle form active status
export const useToggleForm = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (formId) => {
      await apiClient.put(`/form/toggle/${formId}`);
    },
    onSuccess: (_, formId) => {
      queryClient.invalidateQueries({ queryKey: ['forms'] });
      queryClient.invalidateQueries({ queryKey: ['forms', 'detail', formId] });
    },
  });
};

// Delete form mutation (Admin only)
export const useDeleteForm = () => {
  const queryClient = useQueryClient();
  return useMutation<string, Error, string>({
    mutationFn: async (formId) => {
      const response = await apiClient.delete<string>(`/form/delete/${formId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forms'] });
    },
  });
};
