import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 space-y-6">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-16 h-16 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400 shadow-lg relative z-10">
        <AlertCircle className="w-8 h-8" />
      </div>

      <div className="space-y-2 relative z-10 max-w-md">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-100">Page Not Found</h2>
        <p className="text-sm text-slate-400">
          The link you followed might be broken, or the form ID has been deleted from the database.
        </p>
      </div>

      <Link
        to="/"
        className="flex items-center space-x-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-blue-500/10 transition-all duration-300 text-sm relative z-10"
      >
        <Home className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>
    </div>
  );
}
