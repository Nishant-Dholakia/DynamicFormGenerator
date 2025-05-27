import { useState } from 'react';

export default function SignupForm() {
  const [formData, setFormData] = useState({
  username: '',
  emailid: '',
  password: '',
  contact: ''
});


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch('http://localhost:8080/user/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    const text = await response.text();
    if (response.ok) {
      alert("Signup successful: " + text);
      setFormData({ username: '', emailid: '', password: '', contact: '' });
    } else {
      alert("Signup failed: " + text);
    }
  } catch (err) {
    console.error("Error during signup:", err);
    alert("An error occurred. Please try again.");
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-700 flex items-center justify-center px-4 py-12">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>
      
      <div className="relative bg-white/10 backdrop-blur-lg border border-white/20 text-white p-8 rounded-2xl shadow-2xl w-full max-w-md transform hover:scale-[1.02] transition-all duration-300">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Create Account
          </h2>
          <p className="text-gray-300 text-sm mt-2">Join us and start your journey</p>
        </div>

        <form  onSubmit={handleSubmit} className="space-y-6">
          <div className="group">
            <label className="block mb-2 text-sm font-medium text-gray-200 group-focus-within:text-blue-400 transition-colors">
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                name="username"
                onChange={handleChange}
                value={formData.username}
                required
                className="w-full px-4 py-3 pl-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 hover:border-white/30"
                placeholder="Enter your full name"
              />
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>

          <div className="group">
            <label className="block mb-2 text-sm font-medium text-gray-200 group-focus-within:text-blue-400 transition-colors">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                name="emailid"
                onChange={handleChange}
                value={formData.emailid}
                required
                className="w-full px-4 py-3 pl-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 hover:border-white/30"
                placeholder="Enter your email"
              />
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
            </div>
          </div>

          <div className="group">
            <label className="block mb-2 text-sm font-medium text-gray-200 group-focus-within:text-blue-400 transition-colors">
              Contact Number
            </label>
            <div className="relative">
              <input
                type="tel"
                name="contact"
                onChange={handleChange}
                value={formData.contact}
                required
                pattern="[0-9]{10}" // Optional: enforces 10-digit number
                className="w-full px-4 py-3 pl-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 hover:border-white/30"
                placeholder="Enter your contact number"
              />
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h2l3.6 7.59-1.35 2.44A1 1 0 008 17h12v-2H8.42a.25.25 0 01-.23-.14l.03-.05.9-1.64h7.45a1 1 0 00.92-.61l3.24-7.19A1 1 0 0020 4H6.21l-.94-2H1v2h2l3.6 7.59L5.25 14a1 1 0 00.75 1.64H19a1 1 0 000-2H6.42l1.1-2h9.45a1 1 0 00.92-.61l3.24-7.19A1 1 0 0020 2H6.21l-.94-2H1v2h2l3.6 7.59L5.25 14a1 1 0 00.75 1.64H19a1 1 0 000-2H6.42l1.1-2z" />
              </svg>
            </div>
          </div>


          <div className="group">
            <label className="block mb-2 text-sm font-medium text-gray-200 group-focus-within:text-blue-400 transition-colors">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                name="password"
                onChange={handleChange}
                value={formData.password}
                required
                className="w-full px-4 py-3 pl-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 hover:border-white/30"
                placeholder="Create a password"
              />
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
        </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 py-3 px-4 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-transparent"
          >
            <span className="flex items-center justify-center space-x-2">
              <span>Create Account</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            Already have an account?{' '}
            <a href="#" className="text-blue-400 hover:text-blue-300 font-medium transition-colors hover:underline">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}