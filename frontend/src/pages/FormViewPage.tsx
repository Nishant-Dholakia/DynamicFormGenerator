import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useFormDetails } from '../services/formService';
import { useSubmitForm } from '../services/submissionService';
import DynamicFormRenderer from '../components/forms/DynamicFormRenderer';
import { FormSubmissions } from '../types';
import { AlertCircle, CheckCircle, FileText, Lock, ArrowLeft } from 'lucide-react';

export default function FormViewPage() {
  const { id } = useParams<{ id: string }>();
  const [success, setSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Fetch form details
  const { data: form, isLoading, isError, error } = useFormDetails(id || '', !!id);

  // Submit response mutation
  const submitFormMutation = useSubmitForm();

  const handleFormSubmission = async (submission: FormSubmissions) => {
    setSubmitError(null);
    setSuccess(null);

    try {
      await submitFormMutation.mutateAsync(submission);
      setSuccess('Your response was submitted successfully! Thank you.');
    } catch (err: any) {
      setSubmitError(err.message || 'Form submission failed. Please verify inputs and try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-400">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 font-medium animate-pulse">Loading form details...</p>
      </div>
    );
  }

  if (isError || !form) {
    return (
      <div className="glass-card p-8 rounded-2xl border border-red-500/20 text-center space-y-4 max-w-lg mx-auto">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
        <h3 className="text-xl font-bold text-slate-100">Unable to Open Form</h3>
        <p className="text-sm text-slate-400">
          {error?.message || 'The form layout could not be fetched. It may have been deleted or the link is broken.'}
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center space-x-1.5 px-4 py-2 bg-slate-900 border border-slate-800 text-blue-400 font-medium rounded-lg hover:bg-slate-800 text-sm transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
      </div>
    );
  }

  // If the form is closed for responses
  if (!form.isActive) {
    return (
      <div className="glass-card p-8 rounded-2xl border border-slate-850 text-center space-y-4 max-w-lg mx-auto">
        <Lock className="w-12 h-12 text-slate-550 mx-auto" />
        <h3 className="text-xl font-bold text-slate-200">Form Closed</h3>
        <p className="text-sm text-slate-400">
          This form ("{form.title}") is currently closed for responses by its publisher.
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center space-x-1.5 px-4 py-2 bg-slate-900 border border-slate-800 text-slate-350 font-medium rounded-lg hover:bg-slate-800 text-sm transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-4">
      {/* Back button */}
      <Link
        to="/dashboard"
        className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-slate-250 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to Dashboard</span>
      </Link>

      {/* Success View */}
      {success ? (
        <div className="glass-card p-8 rounded-2xl border border-green-500/20 text-center space-y-4 shadow-xl">
          <CheckCircle className="w-12 h-12 text-green-400 mx-auto" />
          <h3 className="text-xl font-bold text-slate-100">Response Recorded</h3>
          <p className="text-sm text-slate-350">{success}</p>
          <div className="pt-2 flex gap-4 justify-center">
            <button
              onClick={() => setSuccess(null)}
              className="px-4 py-2 bg-slate-900 border border-slate-800 text-slate-200 rounded-lg hover:bg-slate-800 text-sm font-semibold transition-all"
            >
              Submit Another Response
            </button>
            <Link
              to="/dashboard"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-md transition-all"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Header Card */}
          <div className="glass-card p-6 sm:p-8 rounded-xl border border-slate-850 space-y-2 relative overflow-hidden shadow-lg">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-2xl pointer-events-none"></div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                {form.category || 'Survey'}
              </span>
              <span className="text-[10px] font-semibold text-green-400 border border-green-500/20 bg-green-500/5 rounded-full px-2 py-0.5">
                Open for responses
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight">{form.title}</h2>
            <p className="text-xs text-slate-500">Please provide answers for each question below.</p>
          </div>

          {/* Submission error */}
          {submitError && (
            <div className="flex items-start space-x-2.5 bg-red-950/30 border border-red-500/20 text-red-400 p-4 rounded-lg text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{submitError}</span>
            </div>
          )}

          {/* Renderer */}
          <DynamicFormRenderer
            formDetails={form}
            onSubmit={handleFormSubmission}
            isSubmitting={submitFormMutation.isPending}
          />
        </div>
      )}
    </div>
  );
}
