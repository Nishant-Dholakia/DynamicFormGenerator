import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({
    isLoggedIn: false,
    user: null,
    isLoading: true
  });

  // Check auth status on initial load
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const [authRes, userRes] = await Promise.all([
          fetch('http://localhost:8080/auth/verify', { credentials: 'include' }),
          fetch('http://localhost:8080/auth/user', { credentials: 'include' })
        ]);
        
        if (authRes.ok && userRes.ok) {
          const [isAuthenticated, userData] = await Promise.all([
            authRes.json(),
            userRes.json()
          ]);
          
          setAuth({
            isLoggedIn: isAuthenticated,
            user: userData,
            isLoading: false
          });
        } else {
          setAuth({ isLoggedIn: false, user: null, isLoading: false });
        }
      } catch (error) {
        setAuth({ isLoggedIn: false, user: null, isLoading: false });
      }
    };
    
    verifyAuth();
  }, []);
const login = async (credentials) => {
  try {
    // 1. Login request
    const loginResponse = await fetch('http://localhost:8080/auth/login', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });

    if (!loginResponse.ok) {
      throw new Error('Login failed');
    }

    // Debug: Check if cookies were set
    console.log('Cookies after login:', document.cookie);
    
    // Add a small delay to ensure cookie is set
    await new Promise(resolve => setTimeout(resolve, 100));

    // 2. Get user data
    const userResponse = await fetch('http://localhost:8080/auth/user', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('User response status:', userResponse.status);
    console.log('User response headers:', [...userResponse.headers.entries()]);

    if (!userResponse.ok) {
      throw new Error(`Failed to fetch user: ${userResponse.status} ${userResponse.statusText}`);
    }

    const userData = await userResponse.json();
    
    setAuth({
      isLoggedIn: true,
      user: userData,
      isLoading: false
    });
    return true;

  } catch (error) {
    console.error("Login error:", error);
    setAuth(prev => ({ ...prev, isLoading: false }));
    return false;
  }
};

  const logout = async () => {
    await fetch('http://localhost:8080/auth/logout', {
      method: 'POST',
      credentials: 'include'
    });
    setAuth({ isLoggedIn: false, user: null, isLoading: false });
  };

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}