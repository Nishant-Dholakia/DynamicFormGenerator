import React, { useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { FormData, Question, FormSubmissions, Answer } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';
import { Mail, Calendar, HelpCircle, Save } from 'lucide-react';

interface DynamicFormRendererProps {
  formDetails: FormData;
  onSubmit: (submission: FormSubmissions) => void;
  isSubmitting?: boolean;
}

export default function DynamicFormRenderer({ formDetails, onSubmit, isSubmitting }: DynamicFormRendererProps) {
  const { user } = useAuth();
  const { questions, formid } = formDetails;

  // 1. Build validation schema dynamically
  const formSchema = useMemo(() => {
    const shape: Record<string, any> = {
      // Submitter email is required for all submissions
      submitterEmail: z.string().min(1, 'Email address is required').email('Invalid email address'),
    };

    questions.forEach((q) => {
      let fieldSchema: any;

      switch (q.answer_type) {
        case 'email':
          if (q.is_required) {
            fieldSchema = z.string().min(1, `${q.question} is required`).email('Invalid email address');
          } else {
            fieldSchema = z.string().email('Invalid email address').optional().or(z.literal(''));
          }
          break;

        case 'number':
          fieldSchema = q.is_required
            ? z.string().min(1, `${q.question} is required`).regex(/^-?\d+(\.\d+)?$/, 'Must be a valid number').transform(Number)
            : z.string().optional().or(z.literal('')).transform(val => val === '' || val === undefined ? undefined : Number(val));
          break;

        case 'checkbox':
          // Checkboxes return an array of selected option strings
          if (q.is_required) {
            fieldSchema = z.array(z.string()).min(1, 'Please select at least one option');
          } else {
            fieldSchema = z.array(z.string()).optional();
          }
          break;

        default: // text, password, textarea, select, radio, date
          if (q.is_required) {
            fieldSchema = z.string().min(1, `${q.question} is required`);
          } else {
            fieldSchema = z.string().optional().or(z.literal(''));
          }
          break;
      }

      shape[q.questionid] = fieldSchema;
    });

    return z.object(shape);
  }, [questions]);

  // 2. Map default values
  const defaultValues = useMemo(() => {
    const defaults: Record<string, any> = {
      submitterEmail: user?.emailid || '',
    };

    questions.forEach((q) => {
      if (q.answer_type === 'checkbox') {
        defaults[q.questionid] = q.defaultValue ? [q.defaultValue] : [];
      } else {
        defaults[q.questionid] = q.defaultValue || '';
      }
    });

    return defaults;
  }, [questions, user]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // 3. Handle submit action
  const handleFormSubmit = (data: Record<string, any>) => {
    const emailid = data.submitterEmail;

    // Transform dynamic values into the backend Answer format
    const answers: Answer[] = questions.map((q) => {
      const rawValue = data[q.questionid];
      
      // Keep value as-is (either string, number, or string[])
      return {
        question: {
          questionid: q.questionid,
        },
        response: {
          value: rawValue === undefined ? '' : rawValue,
        },
      };
    });

    onSubmit({
      emailid,
      form: {
        formid,
      },
      answers,
    });
  };

  const sortedQuestions = useMemo(() => {
    return [...questions].sort((a, b) => a.orderno - b.orderno);
  }, [questions]);

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Submitter Email Field */}
      <div className="glass-card p-6 rounded-xl border border-slate-800 space-y-2">
        <label htmlFor="submitterEmail" className="block text-sm font-semibold text-slate-300">
          Your Email Address <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            <Mail className="w-4 h-4" />
          </div>
          <input
            type="email"
            id="submitterEmail"
            className={cn(
              "w-full pl-10 pr-3 py-2 bg-slate-900 border rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all",
              errors.submitterEmail ? "border-red-500/50 focus:ring-red-500" : "border-slate-800"
            )}
            placeholder="enter@yourmail.com"
            {...register('submitterEmail')}
          />
        </div>
        {errors.submitterEmail && (
          <p className="text-xs text-red-400 mt-1">{errors.submitterEmail.message as string}</p>
        )}
        <p className="text-[11px] text-slate-500">This email will identify your submission in the database.</p>
      </div>

      {/* Dynamic Fields */}
      <div className="space-y-4">
        {sortedQuestions.map((q) => {
          const error = errors[q.questionid];

          return (
            <div key={q.questionid} className="glass-card p-6 rounded-xl border border-slate-800 space-y-3">
              <label className="block text-sm font-semibold text-slate-200">
                {q.question}
                {q.is_required && <span className="text-red-500 ml-1">*</span>}
              </label>

              {/* Render inputs based on type */}
              {(() => {
                switch (q.answer_type) {
                  case 'textarea':
                    return (
                      <textarea
                        id={q.questionid}
                        rows={4}
                        className={cn(
                          "w-full px-3 py-2 bg-slate-900 border rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all",
                          error ? "border-red-500/50 focus:ring-red-500" : "border-slate-800"
                        )}
                        placeholder={q.placeholder || ''}
                        {...register(q.questionid)}
                      />
                    );

                  case 'select':
                    return (
                      <select
                        id={q.questionid}
                        className={cn(
                          "w-full px-3 py-2 bg-slate-900 border rounded-lg text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all",
                          error ? "border-red-500/50 focus:ring-red-500" : "border-slate-800"
                        )}
                        {...register(q.questionid)}
                      >
                        <option value="">Select an option...</option>
                        {q.options.map((opt, i) => (
                          <option key={i} value={opt} className="bg-slate-950">
                            {opt}
                          </option>
                        ))}
                      </select>
                    );

                  case 'radio':
                    return (
                      <div className="space-y-2">
                        {q.options.map((opt, i) => (
                          <label key={i} className="flex items-center space-x-3 text-sm text-slate-300 hover:text-slate-200 cursor-pointer">
                            <input
                              type="radio"
                              value={opt}
                              className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-700 bg-slate-900"
                              {...register(q.questionid)}
                            />
                            <span>{opt}</span>
                          </label>
                        ))}
                      </div>
                    );

                  case 'checkbox':
                    return (
                      <Controller
                        name={q.questionid}
                        control={control}
                        render={({ field }) => {
                          const value: string[] = field.value || [];
                          
                          const handleCheckboxChange = (opt: string, checked: boolean) => {
                            if (checked) {
                              field.onChange([...value, opt]);
                            } else {
                              field.onChange(value.filter((v) => v !== opt));
                            }
                          };

                          return (
                            <div className="space-y-2">
                              {q.options.map((opt, i) => {
                                const isChecked = value.includes(opt);
                                return (
                                  <label key={i} className="flex items-center space-x-3 text-sm text-slate-300 hover:text-slate-200 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      className="w-4 h-4 text-blue-600 border-slate-700 bg-slate-900 rounded focus:ring-blue-500"
                                      onChange={(e) => handleCheckboxChange(opt, e.target.checked)}
                                    />
                                    <span>{opt}</span>
                                  </label>
                                );
                              })}
                            </div>
                          );
                        }}
                      />
                    );

                  case 'date':
                    return (
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                          <Calendar className="w-4 h-4" />
                        </div>
                        <input
                          type="date"
                          id={q.questionid}
                          className={cn(
                            "w-full pl-10 pr-3 py-2 bg-slate-900 border rounded-lg text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all",
                            error ? "border-red-500/50 focus:ring-red-500" : "border-slate-800"
                          )}
                          {...register(q.questionid)}
                        />
                      </div>
                    );

                  default: // text, email, number, password
                    return (
                      <input
                        type={q.answer_type}
                        id={q.questionid}
                        className={cn(
                          "w-full px-3 py-2 bg-slate-900 border rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all",
                          error ? "border-red-500/50 focus:ring-red-500" : "border-slate-800"
                        )}
                        placeholder={q.placeholder || ''}
                        {...register(q.questionid)}
                      />
                    );
                }
              })()}

              {error && (
                <p className="text-xs text-red-400 mt-1">{error.message as string}</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Action Button */}
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            "flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-lg shadow-blue-500/10 hover:bg-blue-500 transition-all duration-300 cursor-pointer disabled:bg-blue-800 disabled:text-slate-400 disabled:cursor-not-allowed"
          )}
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Submitting Response...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Submit Answers</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
