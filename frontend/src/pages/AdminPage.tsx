import React, { useState } from 'react';
import { useAllUsers, useToggleUser, useDeleteUser } from '../services/userService';
import { useAllForms, useDeleteForm } from '../services/formService';
import { useAllSubmissions, useDeleteSubmission } from '../services/submissionService';
import { formatDate } from '../lib/utils';
import { 
  Users, 
  Layers, 
  MessageSquare, 
  ShieldAlert, 
  ToggleLeft, 
  ToggleRight, 
  Trash2, 
  AlertTriangle,
  UserCheck,
  UserX
} from 'lucide-react';
import { cn } from '../lib/utils';

type TabType = 'users' | 'forms' | 'submissions';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<TabType>('users');

  // Fetch all administrative queries
  const { data: users, isLoading: isLoadingUsers, refetch: refetchUsers } = useAllUsers(activeTab === 'users');
  const { data: forms, isLoading: isLoadingForms, refetch: refetchForms } = useAllForms(activeTab === 'forms');
  const { data: submissions, isLoading: isLoadingSubmissions, refetch: refetchSubmissions } = useAllSubmissions(activeTab === 'submissions');

  // Mutation triggers
  const toggleUserMutation = useToggleUser();
  const deleteUserMutation = useDeleteUser();
  const deleteFormMutation = useDeleteForm();
  const deleteSubmissionMutation = useDeleteSubmission();

  const handleToggleUser = async (userId: string) => {
    try {
      await toggleUserMutation.mutateAsync(userId);
    } catch (err) {
      console.error('Failed to toggle user enabled state:', err);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user? All their forms and configurations will be permanently deleted.')) {
      return;
    }
    try {
      await deleteUserMutation.mutateAsync(userId);
    } catch (err) {
      console.error('Failed to delete user:', err);
    }
  };

  const handleDeleteForm = async (formId: string) => {
    if (!window.confirm('Are you sure you want to delete this form layout and all its submissions?')) {
      return;
    }
    try {
      await deleteFormMutation.mutateAsync(formId);
    } catch (err) {
      console.error('Failed to delete form:', err);
    }
  };

  const handleDeleteSubmission = async (submissionId: string) => {
    if (!window.confirm('Are you sure you want to delete this submission response?')) {
      return;
    }
    try {
      await deleteSubmissionMutation.mutateAsync(submissionId);
    } catch (err) {
      console.error('Failed to delete submission:', err);
    }
  };

  const isTabLoading = 
    (activeTab === 'users' && isLoadingUsers) || 
    (activeTab === 'forms' && isLoadingForms) || 
    (activeTab === 'submissions' && isLoadingSubmissions);

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="border-b border-slate-900 pb-5">
        <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
          <ShieldAlert className="w-8 h-8 text-indigo-500" />
          <span>Admin Control Console</span>
        </h1>
        <p className="text-sm text-slate-400">
          Global user directory, form inventory tracking, and submissions registry.
        </p>
      </div>

      {/* Tabs list */}
      <div className="flex border-b border-slate-900 gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('users')}
          className={cn(
            "flex items-center space-x-2 px-5 py-3 border-b-2 font-semibold text-sm transition-all cursor-pointer whitespace-nowrap",
            activeTab === 'users' 
              ? "border-blue-500 text-blue-400" 
              : "border-transparent text-slate-400 hover:text-slate-200"
          )}
        >
          <Users className="w-4 h-4" />
          <span>Users Directory ({users?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('forms')}
          className={cn(
            "flex items-center space-x-2 px-5 py-3 border-b-2 font-semibold text-sm transition-all cursor-pointer whitespace-nowrap",
            activeTab === 'forms' 
              ? "border-blue-500 text-blue-400" 
              : "border-transparent text-slate-400 hover:text-slate-200"
          )}
        >
          <Layers className="w-4 h-4" />
          <span>Form Directory ({forms?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('submissions')}
          className={cn(
            "flex items-center space-x-2 px-5 py-3 border-b-2 font-semibold text-sm transition-all cursor-pointer whitespace-nowrap",
            activeTab === 'submissions' 
              ? "border-blue-500 text-blue-400" 
              : "border-transparent text-slate-400 hover:text-slate-200"
          )}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Submissions Registry ({submissions?.length || 0})</span>
        </button>
      </div>

      {/* Loading state */}
      {isTabLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[30vh] text-slate-400">
          <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-xs font-semibold animate-pulse">Fetching system registries...</p>
        </div>
      ) : (
        <div className="glass-card rounded-2xl border border-slate-850 overflow-hidden shadow-xl">
          {/* Tab 1: Users table */}
          {activeTab === 'users' && (
            <div className="overflow-x-auto">
              {users && users.length > 0 ? (
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-slate-900 border-b border-slate-850 text-slate-400 font-semibold">
                      <th className="p-4">Username</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Contact</th>
                      <th className="p-4">Role</th>
                      <th className="p-4 text-center">Status</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900 text-slate-300">
                    {users.map((u) => (
                      <tr key={u.userid} className="hover:bg-slate-900/30 transition-all">
                        <td className="p-4 font-bold text-slate-200">{u.username}</td>
                        <td className="p-4">{u.emailid}</td>
                        <td className="p-4">{u.contact || 'N/A'}</td>
                        <td className="p-4">
                          <span className={cn(
                            "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border",
                            u.role === 'ADMIN' 
                              ? "bg-red-950/20 text-red-400 border-red-500/10" 
                              : "bg-blue-950/20 text-blue-400 border-blue-500/10"
                          )}>
                            {u.role}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <span className={cn(
                            "inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                            u.enabled 
                              ? "bg-green-950/20 text-green-400 border-green-500/10" 
                              : "bg-amber-955/20 text-amber-400 border-amber-500/10"
                          )}>
                            {u.enabled ? (
                              <>
                                <UserCheck className="w-3.5 h-3.5 mr-0.5" />
                                <span>Enabled</span>
                              </>
                            ) : (
                              <>
                                <UserX className="w-3.5 h-3.5 mr-0.5" />
                                <span>Disabled</span>
                              </>
                            )}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-center space-x-2">
                            <button
                              onClick={() => handleToggleUser(u.userid)}
                              className="p-1.5 text-slate-450 hover:text-slate-200 hover:bg-slate-800 rounded transition-all"
                              title="Toggle Access"
                            >
                              {u.enabled ? <ToggleRight className="w-5 h-5 text-blue-500" /> : <ToggleLeft className="w-5 h-5 text-slate-500" />}
                            </button>
                            <button
                              onClick={() => handleDeleteUser(u.userid)}
                              className="p-1.5 text-slate-450 hover:text-red-400 hover:bg-slate-800 rounded transition-all"
                              title="Delete Account"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-8 text-center text-slate-550 italic">No users found.</div>
              )}
            </div>
          )}

          {/* Tab 2: Forms table */}
          {activeTab === 'forms' && (
            <div className="overflow-x-auto">
              {forms && forms.length > 0 ? (
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-slate-900 border-b border-slate-850 text-slate-400 font-semibold">
                      <th className="p-4">Form Title</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Created Date</th>
                      <th className="p-4 text-center">Status</th>
                      <th className="p-4 text-center">Questions</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900 text-slate-300">
                    {forms.map((f) => (
                      <tr key={f.formid} className="hover:bg-slate-900/30 transition-all">
                        <td className="p-4 font-bold text-slate-200">
                          <div className="space-y-0.5">
                            <span className="line-clamp-1">{f.title}</span>
                            <span className="text-[10px] text-slate-550 font-normal">ID: {f.formid}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 font-medium">
                            {f.category || 'Survey'}
                          </span>
                        </td>
                        <td className="p-4 text-slate-400">{formatDate(f.createdAt)}</td>
                        <td className="p-4 text-center">
                          <span className={cn(
                            "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                            f.isActive 
                              ? "bg-green-950/20 text-green-400 border-green-500/10" 
                              : "bg-slate-900 text-slate-450 border-slate-800"
                          )}>
                            {f.isActive ? 'Active' : 'Closed'}
                          </span>
                        </td>
                        <td className="p-4 text-center font-semibold text-slate-200">
                          {f.questions?.length || 0}
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleDeleteForm(f.formid)}
                            className="p-1.5 text-slate-450 hover:text-red-400 hover:bg-slate-800 rounded transition-all"
                            title="Delete Form"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-8 text-center text-slate-550 italic">No forms found.</div>
              )}
            </div>
          )}

          {/* Tab 3: Submissions table */}
          {activeTab === 'submissions' && (
            <div className="overflow-x-auto">
              {submissions && submissions.length > 0 ? (
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-slate-900 border-b border-slate-855 text-slate-400 font-semibold">
                      <th className="p-4">Submitter Email</th>
                      <th className="p-4">Form ID Reference</th>
                      <th className="p-4">Submitted Date</th>
                      <th className="p-4 text-center">Answers Count</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900 text-slate-300">
                    {submissions.map((s) => (
                      <tr key={s.submissionid} className="hover:bg-slate-900/30 transition-all">
                        <td className="p-4 font-bold text-slate-200">{s.emailid}</td>
                        <td className="p-4 text-slate-400 font-mono text-[10px]">{s.form?.formid || 'N/A'}</td>
                        <td className="p-4 text-slate-400">{formatDate(s.submittedAt)}</td>
                        <td className="p-4 text-center font-semibold text-slate-200">
                          {s.answers?.length || 0}
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => s.submissionid && handleDeleteSubmission(s.submissionid)}
                            className="p-1.5 text-slate-450 hover:text-red-400 hover:bg-slate-800 rounded transition-all"
                            title="Delete Response"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-8 text-center text-slate-550 italic">No submissions found.</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
