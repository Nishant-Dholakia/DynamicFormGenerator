import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Sparkles, FormInput, Activity, FileJson, Shield } from 'lucide-react';

export default function LandingPage() {
  const { isLoggedIn, user } = useAuth();

  return (
    <div className="space-y-24 py-8">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center text-center max-w-4xl mx-auto px-4 pt-12 space-y-8">
        {/* Subtle glowing backgrounds */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-1/3 left-1/4 w-[250px] h-[250px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        {/* Banner Badge */}
        <div className="inline-flex items-center space-x-2 bg-slate-900 border border-slate-800 rounded-full px-3 py-1 text-xs font-semibold text-blue-400">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Vite + React 19 + Tailwind v4 Supported</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
          Create Smart,{' '}
          <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
            Dynamic Forms
          </span>{' '}
          in Seconds
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed">
          FormCraft empowers you to build, customize, and publish forms with zero code. Dynamically render backend schemas with Zod-driven validations instantly.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4 z-10">
          {isLoggedIn ? (
            <Link
              to="/dashboard"
              className="flex items-center justify-center space-x-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-300 group"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          ) : (
            <>
              <Link
                to="/auth/signup"
                className="flex items-center justify-center space-x-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-300 group"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/auth/login"
                className="flex items-center justify-center px-8 py-3.5 bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-800 font-semibold rounded-xl transition-all duration-300"
              >
                Sign In
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Feature Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-8 rounded-2xl border border-slate-800 space-y-4 hover:border-blue-500/30 transition-all duration-300">
          <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center text-blue-400">
            <FormInput className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-100">Dynamic Builder</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Drag-free questions configuration. Define text, password, dropdowns, checkboxes, or dates and watch them adapt.
          </p>
        </div>

        <div className="glass-card p-8 rounded-2xl border border-slate-800 space-y-4 hover:border-indigo-500/30 transition-all duration-300">
          <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400">
            <FileJson className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-100">Schema Driven</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Questions and configuration map back directly to entity tables. Add options or validations, rendered instantly on client screens.
          </p>
        </div>

        <div className="glass-card p-8 rounded-2xl border border-slate-800 space-y-4 hover:border-purple-500/30 transition-all duration-300">
          <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center justify-center text-purple-400">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-100">Secure Submissions</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            JWT session cookies gate all submissions. Secure relational links join forms to creators and answers to questions.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="glass-card rounded-3xl border border-slate-850 p-8 sm:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center md:text-left">
          <div className="space-y-1">
            <h4 className="text-3xl sm:text-4xl font-extrabold text-blue-500">100%</h4>
            <p className="text-xs sm:text-sm font-semibold text-slate-400 uppercase tracking-wider">Dynamic Fields</p>
          </div>
          <div className="space-y-1">
            <h4 className="text-3xl sm:text-4xl font-extrabold text-indigo-400">1ms</h4>
            <p className="text-xs sm:text-sm font-semibold text-slate-400 uppercase tracking-wider">Validation Sync</p>
          </div>
          <div className="space-y-1">
            <h4 className="text-3xl sm:text-4xl font-extrabold text-purple-400">9+</h4>
            <p className="text-xs sm:text-sm font-semibold text-slate-400 uppercase tracking-wider">Field Types</p>
          </div>
          <div className="space-y-1">
            <h4 className="text-3xl sm:text-4xl font-extrabold text-pink-400">Zero</h4>
            <p className="text-xs sm:text-sm font-semibold text-slate-400 uppercase tracking-wider">Code Needed</p>
          </div>
        </div>
      </section>
    </div>
  );
}
