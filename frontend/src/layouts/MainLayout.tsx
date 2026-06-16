import React from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, PlusCircle, User as UserIcon, ShieldAlert, FileSpreadsheet } from 'lucide-react';

export default function MainLayout() {
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 glass border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
                  F
                </div>
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-200 bg-clip-text text-transparent hover:from-blue-300 hover:to-indigo-100 transition-all duration-300">
                  FormCraft
                </span>
              </Link>
            </div>

            {/* Navigation links */}
            <nav className="hidden md:flex items-center space-x-4">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  isActive('/') ? 'text-blue-400 bg-slate-900/60' : 'text-slate-300 hover:text-white hover:bg-slate-900/30'
                }`}
              >
                Home
              </Link>

              {isLoggedIn && (
                <>
                  <Link
                    to="/dashboard"
                    className={`flex items-center space-x-1.5 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                      isActive('/dashboard') ? 'text-blue-400 bg-slate-900/60' : 'text-slate-300 hover:text-white hover:bg-slate-900/30'
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>

                  <Link
                    to="/form/create"
                    className={`flex items-center space-x-1.5 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                      isActive('/form/create') ? 'text-blue-400 bg-slate-900/60' : 'text-slate-300 hover:text-white hover:bg-slate-900/30'
                    }`}
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Create Form</span>
                  </Link>

                  {user?.role === 'ADMIN' && (
                    <Link
                      to="/admin"
                      className={`flex items-center space-x-1.5 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                        isActive('/admin') ? 'text-indigo-400 bg-indigo-950/20 border border-indigo-500/20' : 'text-slate-300 hover:text-white hover:bg-slate-900/30'
                      }`}
                    >
                      <ShieldAlert className="w-4 h-4" />
                      <span>Admin Control</span>
                    </Link>
                  )}
                </>
              )}
            </nav>

            {/* Right side controls (auth status) */}
            <div className="flex items-center space-x-4">
              {isLoggedIn && user ? (
                <div className="flex items-center space-x-3">
                  {/* User Badge */}
                  <div className="hidden sm:flex flex-col items-end">
                    <span className="text-sm font-medium text-slate-200">{user.username}</span>
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full border ${
                      user.role === 'ADMIN' 
                        ? 'bg-red-500/10 text-red-400 border-red-500/20' 
                        : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    }`}>
                      {user.role}
                    </span>
                  </div>

                  {/* Profile/User Icon */}
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 border border-slate-700">
                    <UserIcon className="w-4 h-4" />
                  </div>

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-900/60 rounded-lg transition-all"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/auth/login"
                    className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-all"
                  >
                    Login
                  </Link>
                  <Link
                    to="/auth/signup"
                    className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md hover:shadow-blue-500/10 transition-all duration-300"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Nav Helper (Sub-header style for mobile devices) */}
      {isLoggedIn && (
        <div className="md:hidden flex justify-around bg-slate-900/80 border-b border-slate-800 py-2.5 px-4 text-xs font-semibold">
          <Link to="/" className="text-slate-300 hover:text-white">Home</Link>
          <Link to="/dashboard" className="text-slate-300 hover:text-white">Dashboard</Link>
          <Link to="/form/create" className="text-slate-300 hover:text-white">Create Form</Link>
          {user?.role === 'ADMIN' && <Link to="/admin" className="text-indigo-400 hover:text-indigo-300">Admin</Link>}
        </div>
      )}

      {/* Main Content */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <p className="text-sm text-slate-500">
              &copy; {new Date().getFullYear()} <span className="font-semibold text-slate-400">FormCraft</span>. All rights reserved.
            </p>
            <p className="text-xs text-slate-600 mt-1">
              Construct smart dynamic forms in seconds.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 text-xs text-slate-500">
            <span>📧 support@formcraft.com | 📞 +91 12345 67890</span>
            <div className="flex gap-4">
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-blue-400 transition-colors">LinkedIn</a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-pink-400 transition-colors">Instagram</a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-blue-300 transition-colors">Twitter</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
