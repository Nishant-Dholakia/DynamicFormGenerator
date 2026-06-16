import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../api/client';
import { cn } from '../lib/utils';
import { UserPlus, Mail, Phone, Lock, User as UserIcon, AlertCircle, CheckCircle } from 'lucide-react';

const signupSchema = z
  .object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    emailid: z.string().min(1, 'Email is required').email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type SignupSchemaType = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupSchemaType>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupSchemaType) => {
    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    // Prep payload for backend (omitting contact completely)
    const payload = {
      username: data.username,
      emailid: data.emailid,
      password: data.password,
      role: 'USER',
    };

    try {
      await apiClient.post('/user/save', payload);
      setSuccessMsg('Account registered successfully! Redirecting to login...');
      
      // Delay redirect to allow user to see success message
      setTimeout(() => {
        navigate('/auth/login');
      }, 2000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed. Please check inputs and try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-8">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-lg glass-card rounded-2xl border border-slate-855 p-8 space-y-6 shadow-2xl relative z-10">
        {/* Title */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-blue-600/10 border border-blue-500/20 rounded-xl flex items-center justify-center text-blue-400">
            <UserPlus className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-100">Create An Account</h2>
          <p className="text-sm text-slate-400">Sign up to start generating custom forms</p>
        </div>

        {/* Global Error Banner */}
        {errorMsg && (
          <div className="flex items-start space-x-2.5 bg-red-950/30 border border-red-500/20 text-red-400 p-3.5 rounded-lg text-xs leading-normal">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Global Success Banner */}
        {successMsg && (
          <div className="flex items-start space-x-2.5 bg-green-950/30 border border-green-500/20 text-green-400 p-3.5 rounded-lg text-xs leading-normal">
            <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Username */}
          <div className="space-y-1.5 sm:col-span-2">
            <label htmlFor="username" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <UserIcon className="w-4 h-4" />
              </div>
              <input
                type="text"
                id="username"
                autoComplete="username"
                className={cn(
                  "w-full pl-10 pr-3 py-2 bg-slate-900 border rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm",
                  errors.username ? "border-red-500/50 focus:ring-red-500" : "border-slate-800"
                )}
                placeholder="JaneDoe"
                {...register('username')}
              />
            </div>
            {errors.username && (
              <p className="text-xs text-red-400 mt-1">{errors.username.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1.5 sm:col-span-2">
            <label htmlFor="emailid" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                id="emailid"
                autoComplete="email"
                className={cn(
                  "w-full pl-10 pr-3 py-2 bg-slate-900 border rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm",
                  errors.emailid ? "border-red-500/50 focus:ring-red-500" : "border-slate-800"
                )}
                placeholder="jane@example.com"
                {...register('emailid')}
              />
            </div>
            {errors.emailid && (
              <p className="text-xs text-red-400 mt-1">{errors.emailid.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label htmlFor="password" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                id="password"
                autoComplete="new-password"
                className={cn(
                  "w-full pl-10 pr-3 py-2 bg-slate-900 border rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm",
                  errors.password ? "border-red-500/50 focus:ring-red-500" : "border-slate-800"
                )}
                placeholder="••••••••"
                {...register('password')}
              />
            </div>
            {errors.password && (
              <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label htmlFor="confirmPassword" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                id="confirmPassword"
                autoComplete="new-password"
                className={cn(
                  "w-full pl-10 pr-3 py-2 bg-slate-900 border rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm",
                  errors.confirmPassword ? "border-red-500/50 focus:ring-red-500" : "border-slate-800"
                )}
                placeholder="••••••••"
                {...register('confirmPassword')}
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-red-400 mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="sm:col-span-2 w-full flex items-center justify-center space-x-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-blue-500/10 transition-all duration-300 cursor-pointer disabled:bg-blue-800 disabled:text-slate-400 disabled:cursor-not-allowed text-sm mt-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Creating Account...</span>
              </>
            ) : (
              <span>Create Account</span>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-xs text-slate-400 pt-2 border-t border-slate-900">
          Already have an account?{' '}
          <Link to="/auth/login" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
