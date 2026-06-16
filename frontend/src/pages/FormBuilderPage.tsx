import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useFormDetails, useCreateForm, useUpdateForm } from '../services/formService';
import { Question, FormData } from '../types';
import { 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Settings, 
  Save, 
  FileText, 
  FolderPlus, 
  HelpCircle,
  Eye,
  AlertTriangle,
  Pencil
} from 'lucide-react';
import { cn } from '../lib/utils';

const FIELD_TYPES = [
  { value: 'text', label: 'Short Text' },
  { value: 'email', label: 'Email Input' },
  { value: 'number', label: 'Number Input' },
  { value: 'password', label: 'Password Input' },
  { value: 'textarea', label: 'Paragraph Text' },
  { value: 'select', label: 'Dropdown Select' },
  { value: 'checkbox', label: 'Multiple Checkbox' },
  { value: 'radio', label: 'Single Radio Group' },
  { value: 'date', label: 'Calendar Date' },
];

export default function FormBuilderPage() {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const navigate = useNavigate();

  const createFormMutation = useCreateForm();
  const updateFormMutation = useUpdateForm();

  // Load existing form details if in edit mode
  const { data: existingForm, isLoading: isLoadingForm, isError } = useFormDetails(id || '', isEditMode);

  // Form settings states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);

  // Current question builder state
  const [currentQuestion, setCurrentQuestion] = useState({
    question: '',
    answer_type: 'text' as Question['answer_type'],
    is_required: false,
    placeholder: '',
    defaultValue: '',
  });

  const [options, setOptions] = useState<string[]>([]);
  const [newOption, setNewOption] = useState('');
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Populate form if in edit mode
  useEffect(() => {
    if (isEditMode && existingForm) {
      setTitle(existingForm.title);
      setCategory(existingForm.category);
      setIsActive(existingForm.isActive);
      // Ensure questions are sorted by orderno
      const sorted = [...(existingForm.questions || [])].sort((a, b) => a.orderno - b.orderno);
      setQuestions(sorted);
    }
  }, [isEditMode, existingForm]);

  // Options handling
  const handleAddOption = () => {
    const trimmed = newOption.trim();
    if (!trimmed) return;
    if (options.includes(trimmed)) return;
    setOptions([...options, trimmed]);
    setNewOption('');
  };

  const handleRemoveOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  // Start editing a question
  const handleStartEditQuestion = (q: Question) => {
    setEditingQuestionId(q.questionid);
    setCurrentQuestion({
      question: q.question,
      answer_type: q.answer_type,
      is_required: q.is_required,
      placeholder: q.placeholder || '',
      defaultValue: q.defaultValue || '',
    });
    setOptions(q.options || []);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingQuestionId(null);
    setCurrentQuestion({
      question: '',
      answer_type: 'text',
      is_required: false,
      placeholder: '',
      defaultValue: '',
    });
    setOptions([]);
  };

  // Add or Update Question
  const handleAddOrUpdateQuestion = () => {
    if (!currentQuestion.question.trim()) {
      alert('Please enter a question label.');
      return;
    }

    const requiresOptions = ['select', 'checkbox', 'radio'].includes(currentQuestion.answer_type);
    if (requiresOptions && options.length === 0) {
      alert('Please add at least one option for this field type.');
      return;
    }

    if (editingQuestionId) {
      // Edit mode: update existing question in-place
      const updatedQuestions = questions.map((q) => {
        if (q.questionid === editingQuestionId) {
          return {
            ...q,
            question: currentQuestion.question.trim(),
            answer_type: currentQuestion.answer_type,
            is_required: currentQuestion.is_required,
            options: requiresOptions ? [...options] : [],
            placeholder: currentQuestion.placeholder.trim() || null,
            defaultValue: currentQuestion.defaultValue.trim() || null,
          };
        }
        return q;
      });
      setQuestions(updatedQuestions);
      setEditingQuestionId(null);
    } else {
      // Add mode: append new question
      const nextOrder = questions.length > 0 ? Math.max(...questions.map((q) => q.orderno)) + 1 : 1;

      const newQ: Question = {
        questionid: `temp-${Date.now()}`, // Temporary ID for tracking in UI
        question: currentQuestion.question.trim(),
        answer_type: currentQuestion.answer_type,
        is_required: currentQuestion.is_required,
        options: requiresOptions ? [...options] : [],
        placeholder: currentQuestion.placeholder.trim() || null,
        defaultValue: currentQuestion.defaultValue.trim() || null,
        validations: null,
        orderno: nextOrder,
      };

      setQuestions([...questions, newQ]);
    }

    // Reset current builder block
    setCurrentQuestion({
      question: '',
      answer_type: 'text',
      is_required: false,
      placeholder: '',
      defaultValue: '',
    });
    setOptions([]);
  };

  // Remove question
  const handleRemoveQuestion = (questionId: string) => {
    const filtered = questions.filter((q) => q.questionid !== questionId);
    // Recalculate order numbers sequentially
    const updated = filtered.map((q, idx) => ({ ...q, orderno: idx + 1 }));
    setQuestions(updated);
    
    // If the removed question was being edited, cancel edit mode
    if (editingQuestionId === questionId) {
      handleCancelEdit();
    }
  };

  // Reordering questions
  const moveQuestion = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === questions.length - 1) return;

    const updated = [...questions];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    // Swap items
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    // Fix orderno values based on new indices
    const finalized = updated.map((q, idx) => ({ ...q, orderno: idx + 1 }));
    setQuestions(finalized);
  };

  // Submit form layout to API
  const handleSaveForm = async () => {
    if (!title.trim()) {
      setSaveError('Form title is required.');
      return;
    }
    if (questions.length === 0) {
      setSaveError('Please add at least one question to the form.');
      return;
    }

    setSaveError(null);
    setIsSaving(true);

    try {
      if (isEditMode && id) {
        // Mapping questions for update (JPA Entity format)
        const mappedQuestions = questions.map((q) => ({
          questionid: q.questionid.startsWith('temp-') ? (null as any) : q.questionid,
          question: q.question,
          answer_type: q.answer_type,
          is_required: q.is_required,
          orderno: q.orderno,
          options: q.options,
          placeholder: q.placeholder,
          defaultValue: q.defaultValue,
          validations: q.validations,
        }));

        await updateFormMutation.mutateAsync({
          formid: id,
          title: title.trim(),
          category: category.trim() || 'Survey',
          isActive,
          questions: mappedQuestions as any,
          createdAt: existingForm?.createdAt || '',
        });
      } else {
        // Mapping questions for create (DTO format)
        const mappedQuestions = questions.map((q) => ({
          label: q.question,
          type: q.answer_type,
          required: q.is_required,
          order: q.orderno,
          options: q.options,
          placeholder: q.placeholder || '',
        }));

        await createFormMutation.mutateAsync({
          title: title.trim(),
          category: category.trim() || 'Survey',
          isActive,
          questions: mappedQuestions as any,
        });
      }

      navigate('/dashboard');
    } catch (err: any) {
      setSaveError(err.message || 'Failed to save form. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const isOptionsField = ['select', 'checkbox', 'radio'].includes(currentQuestion.answer_type);

  if (isEditMode && isLoadingForm) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-400">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 animate-pulse">Loading form configurations...</p>
      </div>
    );
  }

  if (isEditMode && isError) {
    return (
      <div className="glass-card p-6 rounded-2xl border border-red-500/20 text-center space-y-4 max-w-lg mx-auto">
        <AlertTriangle className="w-12 h-12 text-red-400 mx-auto" />
        <h3 className="text-lg font-bold text-slate-100">Failed to load form</h3>
        <p className="text-sm text-slate-400">The requested form could not be found or has been deleted.</p>
        <Link to="/dashboard" className="inline-block px-4 py-2 bg-slate-900 border border-slate-800 text-blue-400 rounded-lg hover:bg-slate-800">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-900 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            {isEditMode ? 'Edit Form Setup' : 'Create Custom Form'}
          </h1>
          <p className="text-sm text-slate-400">
            Define properties, choose dynamic field answers, and customize validators.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Link
            to="/dashboard"
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 rounded-lg text-sm transition-all"
          >
            Cancel
          </Link>
          <button
            onClick={handleSaveForm}
            disabled={isSaving}
            className="flex items-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-blue-500/10 transition-all duration-300 text-sm cursor-pointer disabled:bg-blue-800"
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{isEditMode ? 'Update Form' : 'Publish Form'}</span>
          </button>
        </div>
      </div>

      {saveError && (
        <div className="flex items-start space-x-2.5 bg-red-950/30 border border-red-500/20 text-red-400 p-4 rounded-lg text-sm">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{saveError}</span>
        </div>
      )}

      {/* Grid panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Configurations Panel - Left (Col Span 7) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 1: Form Properties */}
          <div className="glass-card p-6 rounded-xl border border-slate-850 space-y-4">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" />
              <span>Form General Info</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-350 uppercase tracking-wider">Form Title</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="e.g. Customer Satisfaction Survey"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-355 uppercase tracking-wider">Category</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="e.g. Feedback"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <input
                type="checkbox"
                id="form-active"
                className="w-4 h-4 text-blue-600 border-slate-800 bg-slate-900 rounded focus:ring-blue-500"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
              />
              <label htmlFor="form-active" className="text-sm font-medium text-slate-350 cursor-pointer">
                Publish form immediately (allow submissions)
              </label>
            </div>
          </div>

          {/* Section 2: Add Question Builder */}
          <div className={cn(
            "glass-card p-6 rounded-xl border transition-all duration-300 space-y-4",
            editingQuestionId ? "border-indigo-500/30 bg-indigo-950/5 shadow-lg shadow-indigo-950/20" : "border-slate-850"
          )}>
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              {editingQuestionId ? (
                <Settings className="w-5 h-5 text-indigo-400" />
              ) : (
                <Plus className="w-5 h-5 text-blue-500" />
              )}
              <span>{editingQuestionId ? 'Edit Form Field' : 'Configure Dynamic Field'}</span>
            </h3>

            <div className="space-y-4">
              {/* Question Text */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-350 uppercase tracking-wider">Question Label</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="e.g. What is your full name?"
                  value={currentQuestion.question}
                  onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })}
                />
              </div>

              {/* Field Type & Required checkbox */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-350 uppercase tracking-wider">Field Type</label>
                  <select
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    value={currentQuestion.answer_type}
                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, answer_type: e.target.value as any })}
                  >
                    {FIELD_TYPES.map((t) => (
                      <option key={t.value} value={t.value} className="bg-slate-950">
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center space-x-3 sm:pt-6">
                  <input
                    type="checkbox"
                    id="field-required"
                    className="w-4 h-4 text-blue-600 border-slate-800 bg-slate-900 rounded focus:ring-blue-500"
                    checked={currentQuestion.is_required}
                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, is_required: e.target.checked })}
                  />
                  <label htmlFor="field-required" className="text-sm font-medium text-slate-355 cursor-pointer">
                    Required field (submit check)
                  </label>
                </div>
              </div>

              {/* Option Setup (Visible only for Select/Checkbox/Radio) */}
              {isOptionsField && (
                <div className="p-4 bg-slate-950/40 border border-slate-900 rounded-xl space-y-3">
                  <label className="block text-xs font-semibold text-slate-350 uppercase tracking-wider">
                    Add Options Checklist
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="flex-grow px-3 py-1.5 bg-slate-900 border border-slate-850 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                      placeholder="e.g. Strongly Agree"
                      value={newOption}
                      onChange={(e) => setNewOption(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddOption())}
                    />
                    <button
                      type="button"
                      onClick={handleAddOption}
                      className="px-4 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-750 text-xs font-semibold rounded-lg"
                    >
                      Add option
                    </button>
                  </div>

                  {options.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {options.map((opt, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded bg-slate-900 text-slate-300 border border-slate-800 gap-1.5"
                        >
                          <span>{opt}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveOption(idx)}
                            className="text-red-400 hover:text-red-350 focus:outline-none font-bold"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-500 italic">No options defined yet. Add options to fill the choice list.</p>
                  )}
                </div>
              )}

              {/* Placeholders & Defaults */}
              {!isOptionsField && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-350 uppercase tracking-wider">
                      Placeholder (optional)
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="e.g. Enter your name here"
                      value={currentQuestion.placeholder}
                      onChange={(e) => setCurrentQuestion({ ...currentQuestion, placeholder: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-355 uppercase tracking-wider">
                      Default Value (optional)
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="e.g. John Doe"
                      value={currentQuestion.defaultValue}
                      onChange={(e) => setCurrentQuestion({ ...currentQuestion, defaultValue: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {/* Add field CTA */}
              {editingQuestionId ? (
                <div className="flex gap-3 mt-2">
                  <button
                    type="button"
                    onClick={handleAddOrUpdateQuestion}
                    className="flex-1 flex items-center justify-center space-x-1.5 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-sm cursor-pointer transition-all duration-300"
                  >
                    <span>Update Field</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="flex-1 flex items-center justify-center space-x-1.5 py-2 px-4 bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 font-semibold rounded-lg text-sm cursor-pointer transition-all duration-300"
                  >
                    <span>Cancel</span>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleAddOrUpdateQuestion}
                  className="w-full flex items-center justify-center space-x-1.5 py-2 px-4 bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-800 font-semibold rounded-lg text-sm mt-2 cursor-pointer transition-all duration-300"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Question to Form</span>
                </button>
              )}
            </div>
          </div>

          {/* Section 3: Reorder Checklist */}
          <div className="glass-card p-6 rounded-xl border border-slate-850 space-y-4">
            <h3 className="text-lg font-bold text-slate-100">Arranged Form Fields</h3>
            
            {questions.length === 0 ? (
              <p className="text-sm text-slate-500 italic text-center py-4">No questions added yet. Construct fields above.</p>
            ) : (
              <div className="divide-y divide-slate-900">
                {questions.map((q, idx) => (
                  <div 
                    key={q.questionid} 
                    className={cn(
                      "flex justify-between items-center py-3.5 px-3 -mx-3 rounded-xl transition-all duration-200 gap-4 first:mt-0 last:mb-0",
                      editingQuestionId === q.questionid 
                        ? "bg-indigo-950/20 border-l-2 border-indigo-500" 
                        : "border-l-2 border-transparent"
                    )}
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-500">{q.orderno}.</span>
                        <h4 className="text-sm font-bold text-slate-200 line-clamp-1">{q.question}</h4>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-855 font-medium capitalize">
                          {q.answer_type}
                        </span>
                        {q.is_required && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-950/20 text-red-400 border border-red-500/10 font-medium">
                            Required
                          </span>
                        )}
                        {q.options && q.options.length > 0 && (
                          <span className="text-[10px] text-slate-500 font-medium">
                            {q.options.length} options
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center space-x-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => moveQuestion(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 text-slate-500 hover:text-slate-250 hover:bg-slate-900 rounded disabled:opacity-30 disabled:hover:bg-transparent"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveQuestion(idx, 'down')}
                        disabled={idx === questions.length - 1}
                        className="p-1 text-slate-500 hover:text-slate-250 hover:bg-slate-900 rounded disabled:opacity-30 disabled:hover:bg-transparent"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStartEditQuestion(q)}
                        className={cn(
                          "p-1 rounded transition-colors",
                          editingQuestionId === q.questionid
                            ? "text-indigo-400 bg-indigo-950/40"
                            : "text-slate-500 hover:text-indigo-400 hover:bg-slate-900"
                        )}
                        title="Edit Question"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveQuestion(q.questionid)}
                        className="p-1 text-slate-500 hover:text-red-400 hover:bg-slate-900 rounded"
                        title="Delete Question"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Live Preview Panel - Right (Col Span 5) */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-900 pb-2">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Eye className="w-5 h-5 text-indigo-400" />
              <span>Live Visual Preview</span>
            </h3>
            <span className="text-[10px] font-semibold text-slate-500 animate-pulse">Auto-updating...</span>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-850 space-y-6 shadow-xl max-h-[80vh] overflow-y-auto">
            {/* Title / Category preview */}
            <div className="space-y-1.5 border-b border-slate-900 pb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                {category.trim() || 'Survey'}
              </span>
              <h2 className="text-xl font-extrabold tracking-tight text-slate-100">
                {title.trim() || 'Untitled Document'}
              </h2>
            </div>

            {/* Questions list preview */}
            {questions.length === 0 ? (
              <div className="text-center py-12 text-slate-500 space-y-2">
                <HelpCircle className="w-10 h-10 mx-auto text-slate-650" />
                <p className="text-sm italic">Add questions on the left configurations panel to visualize fields in real-time.</p>
              </div>
            ) : (
              <div className="space-y-5">
                {questions.map((q) => (
                  <div key={q.questionid} className="space-y-2 text-left">
                    <label className="block text-sm font-semibold text-slate-300">
                      {q.question || 'Placeholder Question'}
                      {q.is_required && <span className="text-red-500 ml-1">*</span>}
                    </label>

                    {/* Rendering inputs dynamically based on selected type */}
                    {(() => {
                      switch (q.answer_type) {
                        case 'textarea':
                          return (
                            <textarea
                              disabled
                              rows={3}
                              className="w-full px-3 py-2 bg-slate-900/60 border border-slate-800 rounded-lg text-slate-500 text-xs cursor-not-allowed"
                              placeholder={q.placeholder || 'Text Area Input'}
                            />
                          );

                        case 'select':
                          return (
                            <select
                              disabled
                              className="w-full px-3 py-2 bg-slate-900/60 border border-slate-800 rounded-lg text-slate-500 text-xs cursor-not-allowed"
                            >
                              <option>Select Option...</option>
                              {q.options?.map((opt, idx) => (
                                <option key={idx}>{opt}</option>
                              ))}
                            </select>
                          );

                        case 'checkbox':
                          return (
                            <div className="space-y-1.5 pl-1">
                              {q.options?.length > 0 ? (
                                q.options.map((opt, idx) => (
                                  <div key={idx} className="flex items-center space-x-2.5 text-xs text-slate-500">
                                    <input type="checkbox" disabled className="rounded border-slate-800 bg-slate-900" />
                                    <span>{opt}</span>
                                  </div>
                                ))
                              ) : (
                                <span className="text-xs text-slate-550 italic">No options defined</span>
                              )}
                            </div>
                          );

                        case 'radio':
                          return (
                            <div className="space-y-1.5 pl-1">
                              {q.options?.length > 0 ? (
                                q.options.map((opt, idx) => (
                                  <div key={idx} className="flex items-center space-x-2.5 text-xs text-slate-500">
                                    <input type="radio" disabled className="border-slate-800 bg-slate-900" />
                                    <span>{opt}</span>
                                  </div>
                                ))
                              ) : (
                                <span className="text-xs text-slate-550 italic">No options defined</span>
                              )}
                            </div>
                          );

                        case 'date':
                          return (
                            <input
                              type="date"
                              disabled
                              className="w-full px-3 py-2 bg-slate-900/60 border border-slate-800 rounded-lg text-slate-500 text-xs cursor-not-allowed"
                            />
                          );

                        default: // text, email, number, password
                          return (
                            <input
                              type={q.answer_type}
                              disabled
                              className="w-full px-3 py-2 bg-slate-900/60 border border-slate-800 rounded-lg text-slate-500 text-xs cursor-not-allowed"
                              placeholder={q.placeholder || `Type dynamic ${q.answer_type}...`}
                              defaultValue={q.defaultValue || ''}
                            />
                          );
                      }
                    })()}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
