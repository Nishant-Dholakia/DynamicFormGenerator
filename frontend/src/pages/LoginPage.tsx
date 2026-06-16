import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';
import { LogIn, KeyRound, User as UserIcon, AlertCircle } from 'lucide-react';

const loginSchema = z.object({
  username: z.string().min(1, 'Username or Email is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginSchemaType = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Read location state for post-login redirect
  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginSchemaType) => {
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const success = await login({
        username: data.username,
        password: data.password,
      });

      if (success) {
        navigate(from, { replace: true });
      } else {
        setErrorMsg('Failed to fetch user details after authentication.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid username or password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md glass-card rounded-2xl border border-slate-850 p-8 space-y-6 shadow-2xl relative z-10">
        {/* Title */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-blue-600/10 border border-blue-500/20 rounded-xl flex items-center justify-center text-blue-400">
            <LogIn className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-100">Welcome Back</h2>
          <p className="text-sm text-slate-400">Sign in to your account to continue</p>
        </div>

        {/* Global Error Banner */}
        {errorMsg && (
          <div className="flex items-start space-x-2.5 bg-red-950/30 border border-red-500/20 text-red-400 p-3.5 rounded-lg text-xs leading-normal">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Username */}
          <div className="space-y-1.5">
            <label htmlFor="username" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Username or Email
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

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label htmlFor="password" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Password
              </label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                type="password"
                id="password"
                autoComplete="current-password"
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-blue-500/10 transition-all duration-300 cursor-pointer disabled:bg-blue-800 disabled:text-slate-400 disabled:cursor-not-allowed text-sm"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Signing In...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-xs text-slate-400 pt-2 border-t border-slate-900">
          Don't have an account?{' '}
          <Link to="/auth/signup" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}
