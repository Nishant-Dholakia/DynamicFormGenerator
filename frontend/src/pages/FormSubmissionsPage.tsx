import React, { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useFormDetails } from '../services/formService';
import { useFormSubmissions, useDeleteSubmission } from '../services/submissionService';
import { formatDate } from '../lib/utils';
import { 
  ArrowLeft, 
  MessageSquare, 
  Trash2, 
  AlertTriangle, 
  Clock, 
  Mail, 
  Layers,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function FormSubmissionsPage() {
  const { id } = useParams<{ id: string }>();

  // Fetch form configuration for question text lookup
  const { data: form, isLoading: isLoadingForm } = useFormDetails(id || '', !!id);

  // Fetch submissions list for this form
  const { data: submissions, isLoading: isLoadingSubs, isError, error } = useFormSubmissions(id || '', !!id);

  const deleteSubmissionMutation = useDeleteSubmission();

  // Track expanded cards
  const [expandedSubId, setExpandedSubId] = useState<string | null>(null);

  // Map of questionid -> Question configuration for fast labels lookup
  const questionMap = useMemo(() => {
    const map: Record<string, any> = {};
    if (form?.questions) {
      form.questions.forEach((q) => {
        map[q.questionid] = q;
      });
    }
    return map;
  }, [form]);

  const toggleExpand = (subId: string) => {
    if (expandedSubId === subId) {
      setExpandedSubId(null);
    } else {
      setExpandedSubId(subId);
    }
  };

  const handleDeleteSub = async (subId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card expansion toggle
    if (!window.confirm('Are you sure you want to delete this submission response? This cannot be undone.')) {
      return;
    }

    try {
      await deleteSubmissionMutation.mutateAsync(subId);
    } catch (err) {
      console.error('Failed to delete submission:', err);
    }
  };

  const renderResponseValue = (value: any) => {
    if (value === null || value === undefined) return <span className="text-slate-500 italic">No Answer</span>;
    if (Array.isArray(value)) {
      if (value.length === 0) return <span className="text-slate-500 italic">No Answer</span>;
      return (
        <div className="flex flex-wrap gap-1">
          {value.map((v, idx) => (
            <span key={idx} className="text-xs px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
              {v}
            </span>
          ))}
        </div>
      );
    }
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    return <span className="text-slate-350">{String(value)}</span>;
  };

  const isLoading = isLoadingForm || isLoadingSubs;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-400">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 font-medium animate-pulse">Loading form submissions...</p>
      </div>
    );
  }

  if (isError || !form) {
    return (
      <div className="glass-card p-6 rounded-2xl border border-red-500/20 text-center space-y-4 max-w-lg mx-auto">
        <AlertTriangle className="w-12 h-12 text-red-400 mx-auto" />
        <h3 className="text-lg font-bold text-slate-100">Failed to load submissions</h3>
        <p className="text-sm text-slate-400">{(error as any)?.message || 'Something went wrong.'}</p>
        <Link to="/dashboard" className="inline-block px-4 py-2 bg-slate-900 border border-slate-800 text-blue-400 rounded-lg hover:bg-slate-800">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Back button */}
      <div className="flex justify-between items-center border-b border-slate-900 pb-5">
        <div className="space-y-1">
          <Link
            to="/dashboard"
            className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-slate-250 transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Form Responses</h1>
          <p className="text-sm text-slate-400">
            Form: <span className="text-slate-200 font-semibold">{form.title}</span>
          </p>
        </div>
      </div>

      {/* Submissions Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="glass-card p-5 rounded-xl border border-slate-850 flex items-center space-x-4">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Responses</p>
            <p className="text-xl font-bold text-slate-200">{submissions?.length || 0}</p>
          </div>
        </div>

        <div className="glass-card p-5 rounded-xl border border-slate-850 flex items-center space-x-4">
          <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</p>
            <p className="text-xl font-bold text-slate-200">{form.category || 'Survey'}</p>
          </div>
        </div>
      </div>

      {/* Replies directory */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold tracking-tight text-slate-200">Submissions Log</h2>

        {!submissions || submissions.length === 0 ? (
          <div className="glass-card p-12 rounded-2xl border border-slate-850 text-center space-y-3 max-w-md mx-auto">
            <FileSpreadsheet className="w-12 h-12 text-slate-650 mx-auto" />
            <h3 className="text-base font-bold text-slate-200">No Submissions Yet</h3>
            <p className="text-xs text-slate-450 leading-relaxed">
              Nobody has filled out this form yet. Share the submission link to gather responses.
            </p>
            <Link
              to={`/form/view/${form.formid}`}
              className="inline-flex items-center space-x-1 bg-slate-900 border border-slate-800 text-blue-400 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-slate-800 transition-all"
            >
              <span>Test Submit Form</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {submissions.map((sub, idx) => {
              const isExpanded = expandedSubId === sub.submissionid;
              return (
                <div 
                  key={sub.submissionid} 
                  className={cn(
                    "glass-card rounded-xl border transition-all duration-200 overflow-hidden cursor-pointer",
                    isExpanded ? "border-slate-650 ring-1 ring-slate-700/50" : "border-slate-850 hover:border-slate-800"
                  )}
                  onClick={() => sub.submissionid && toggleExpand(sub.submissionid)}
                >
                  {/* Summary Bar */}
                  <div className="p-5 flex justify-between items-center gap-4 flex-wrap sm:flex-nowrap">
                    <div className="flex items-center space-x-3.5 min-w-0">
                      <div className="text-xs font-bold text-slate-550 shrink-0">#{submissions.length - idx}</div>
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center space-x-2 text-sm font-semibold text-slate-250 min-w-0">
                          <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span className="truncate">{sub.emailid}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-slate-500">
                          <Clock className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                          <span>Submitted {formatDate(sub.submittedAt)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        onClick={(e) => sub.submissionid && handleDeleteSub(sub.submissionid, e)}
                        className="p-2 text-slate-500 hover:text-red-400 hover:bg-slate-900 rounded-lg transition-colors cursor-pointer"
                        title="Delete Submission"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      
                      <div className="p-1.5 text-slate-500 bg-slate-950/40 rounded border border-slate-900">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Answers details */}
                  {isExpanded && (
                    <div className="px-5 pb-6 border-t border-slate-950 bg-slate-950/20 space-y-4 pt-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Answers Detail</h4>
                      <div className="grid grid-cols-1 gap-4">
                        {sub.answers?.map((ans, aIdx) => {
                          const questionConfig = questionMap[ans.question?.questionid];
                          const questionText = questionConfig?.question || `Question ID: ${ans.question?.questionid}`;
                          const answerType = questionConfig?.answer_type || 'text';

                          return (
                            <div key={aIdx} className="space-y-1 bg-slate-950/45 p-3.5 rounded-lg border border-slate-900/60">
                              <div className="flex justify-between items-start gap-4">
                                <span className="text-xs font-semibold text-slate-400">{questionText}</span>
                                <span className="text-[9px] uppercase font-bold text-slate-600 tracking-wider">
                                  {answerType}
                                </span>
                              </div>
                              <div className="text-sm font-medium pt-1">
                                {renderResponseValue(ans.response?.value)}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
