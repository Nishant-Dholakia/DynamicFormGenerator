import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUserForms, useToggleForm } from '../services/formService';
import { formatDate, cn } from '../lib/utils';
import { 
  Plus, 
  FileText, 
  Eye, 
  Edit, 
  MessageSquare, 
  Activity, 
  Layers, 
  CheckCircle2, 
  AlertTriangle,
  FolderDot,
  Share2
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: forms, isLoading, isError, error } = useUserForms(user?.id);
  const toggleFormMutation = useToggleForm();
  
  const [copiedFormId, setCopiedFormId] = useState<string | null>(null);

  const handleShare = async (formId: string, e: React.MouseEvent) => {
    e.preventDefault();
    const url = `${window.location.origin}/form/view/${formId}`;
    
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        // Fallback for environment without Clipboard API support
        const textArea = document.createElement('textarea');
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      
      setCopiedFormId(formId);
      setTimeout(() => setCopiedFormId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      alert('Could not copy link automatically. Here is the URL: ' + url);
    }
  };

  // Calculate quick stats
  const stats = useMemo(() => {
    if (!forms) return { total: 0, active: 0, inactive: 0, submissionsCount: 0 };
    
    let active = 0;
    let submissionsCount = 0;

    forms.forEach((f) => {
      if (f.isActive) active++;
      if (f.submissions) {
        submissionsCount += f.submissions.length;
      }
    });

    return {
      total: forms.length,
      active,
      inactive: forms.length - active,
      submissionsCount,
    };
  }, [forms]);

  const handleToggleActive = async (formId: string) => {
    try {
      await toggleFormMutation.mutateAsync(formId);
    } catch (err) {
      console.error('Failed to toggle active state:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-400">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 font-medium animate-pulse">Loading dashboard forms...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="glass-card p-6 rounded-2xl border border-red-500/20 text-center space-y-4 max-w-lg mx-auto">
        <AlertTriangle className="w-12 h-12 text-red-400 mx-auto" />
        <h3 className="text-lg font-bold text-slate-100">Failed to load dashboard data</h3>
        <p className="text-sm text-slate-400">{(error as any)?.message || 'Something went wrong.'}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-slate-900 border border-slate-800 text-slate-350 hover:text-white rounded-lg transition-all"
        >
          Retry Load
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-900 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Your Dashboard</h1>
          <p className="text-sm text-slate-400">Manage your dynamic forms, track replies, and toggle access.</p>
        </div>
        <Link
          to="/form/create"
          className="flex items-center space-x-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-blue-500/10 transition-all duration-300 text-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Form</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Forms */}
        <div className="glass-card p-6 rounded-xl border border-slate-850 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Forms</p>
            <p className="text-2xl font-extrabold text-slate-100">{stats.total}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/10">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        {/* Active Forms */}
        <div className="glass-card p-6 rounded-xl border border-slate-850 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Forms</p>
            <p className="text-2xl font-extrabold text-green-400">{stats.active}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400 border border-green-500/10">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        {/* Inactive Forms */}
        <div className="glass-card p-6 rounded-xl border border-slate-850 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Inactive</p>
            <p className="text-2xl font-extrabold text-slate-400">{stats.inactive}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-slate-800/50 flex items-center justify-center text-slate-450 border border-slate-800">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        {/* Responses */}
        <div className="glass-card p-6 rounded-xl border border-slate-850 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Replies</p>
            <p className="text-2xl font-extrabold text-purple-400">{stats.submissionsCount}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/10">
            <MessageSquare className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Forms Content */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight text-slate-200">Active Form Directory</h2>

        {!forms || forms.length === 0 ? (
          <div className="glass-card p-12 rounded-2xl border border-slate-850 text-center space-y-4 max-w-md mx-auto">
            <FolderDot className="w-16 h-16 text-slate-650 mx-auto" />
            <h3 className="text-lg font-bold text-slate-200">No Forms Found</h3>
            <p className="text-sm text-slate-400">You haven't built any dynamic forms yet. Get started by creating your first form.</p>
            <Link
              to="/form/create"
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow font-medium text-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Create Form</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {forms.map((form) => (
              <div 
                key={form.formid} 
                className="glass-card p-6 rounded-xl border border-slate-850 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all duration-300"
              >
                {/* Top Title/Category */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                      {form.category || 'Survey'}
                    </span>
                    
                    {/* Status Slider Toggle */}
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={form.isActive} 
                        onChange={() => handleToggleActive(form.formid)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600 peer-checked:after:bg-white"></div>
                      <span className="ml-2 text-xs font-semibold text-slate-400 w-12">
                        {form.isActive ? 'Active' : 'Closed'}
                      </span>
                    </label>
                  </div>
                  
                  <h3 className="text-lg font-bold text-slate-100 tracking-tight line-clamp-1">{form.title}</h3>
                  <p className="text-xs text-slate-500">Created {formatDate(form.createdAt)}</p>
                </div>

                {/* Question Info / Responses count */}
                <div className="flex justify-between items-center text-xs text-slate-400 bg-slate-950/40 border border-slate-900 rounded-lg p-3">
                  <span>{form.questions?.length || 0} Questions</span>
                  <span className="text-purple-400 font-semibold">{form.submissions?.length || 0} Submissions</span>
                </div>

                {/* Action hub links */}
                <div className="grid grid-cols-5 gap-1.5 pt-2 border-t border-slate-900">
                  <Link
                    to={`/form/view/${form.formid}`}
                    className="flex flex-col items-center justify-center p-2 rounded-lg bg-slate-900 hover:bg-slate-850 hover:text-blue-400 text-[10px] font-medium text-slate-400 transition-all gap-1 text-center"
                    title="Fill / Test Form"
                  >
                    <Eye className="w-4 h-4 text-blue-500" />
                    <span>Fill View</span>
                  </Link>

                  <Link
                    to={`/form/edit/${form.formid}`}
                    className="flex flex-col items-center justify-center p-2 rounded-lg bg-slate-900 hover:bg-slate-850 hover:text-yellow-400 text-[10px] font-medium text-slate-400 transition-all gap-1 text-center"
                    title="Edit Form Layout"
                  >
                    <Edit className="w-4 h-4 text-yellow-500" />
                    <span>Edit Setup</span>
                  </Link>

                  <button
                    onClick={(e) => handleShare(form.formid, e)}
                    className="flex flex-col items-center justify-center p-2 rounded-lg bg-slate-900 hover:bg-slate-850 hover:text-green-400 text-[10px] font-medium text-slate-400 transition-all gap-1 text-center cursor-pointer"
                    title="Copy Share Link"
                  >
                    <Share2 className={cn("w-4 h-4", copiedFormId === form.formid ? "text-green-400 animate-bounce" : "text-green-500")} />
                    <span className="truncate">{copiedFormId === form.formid ? 'Copied!' : 'Share'}</span>
                  </button>

                  <Link
                    to={`/form/submissions/${form.formid}`}
                    className="col-span-2 flex items-center justify-center p-2 rounded-lg bg-slate-900 hover:bg-slate-850 hover:text-purple-400 text-[10px] font-medium text-slate-400 transition-all gap-1.5 text-center"
                    title="View Form Submissions"
                  >
                    <MessageSquare className="w-4 h-4 text-purple-500" />
                    <span className="truncate">Replies ({form.submissions?.length || 0})</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
