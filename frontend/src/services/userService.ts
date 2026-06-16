import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/client';
import { User } from '../types';

// Fetch all users (Admin only)
export const useAllUsers = (enabled: boolean = true) => {
  return useQuery<User[]>({
    queryKey: ['users', 'all'],
    queryFn: async () => {
      const response = await apiClient.get<User[]>('/user/all');
      return response.data;
    },
    enabled,
  });
};

// Fetch specific user details by ID
export const useUserDetails = (userId: string, enabled: boolean = true) => {
  return useQuery<User>({
    queryKey: ['users', 'detail', userId],
    queryFn: async () => {
      const response = await apiClient.get<User>(`/user/get/${userId}`);
      return response.data;
    },
    enabled: enabled && !!userId,
  });
};

// Update user details mutation
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation<string, Error, Partial<User> & { userid: string }>({
    mutationFn: async (user) => {
      const response = await apiClient.put<string>('/user/update', user);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['users', 'detail', variables.userid] });
      // Invalidate current authenticated user as well
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
  });
};

// Toggle user enabled/disabled status (Admin only)
export const useToggleUser = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (userId) => {
      await apiClient.put(`/user/toggle/${userId}`);
    },
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['users', 'detail', userId] });
    },
  });
};

// Delete user mutation (Admin only)
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation<string, Error, string>({
    mutationFn: async (userId) => {
      const response = await apiClient.delete<string>(`/user/delete/${userId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
