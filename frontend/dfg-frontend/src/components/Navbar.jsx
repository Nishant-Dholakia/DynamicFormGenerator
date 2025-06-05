import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

function Navbar() {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();
    await logout();
    navigate('/');
  };

  return (
    <nav className="bg-gray-800 text-white py-4 shadow-md">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-white hover:text-blue-400 transition-colors">
          Dynamic Form Generator
        </Link>
        <div className="space-x-6 text-sm sm:text-base">
          <Link to="/" className="hover:text-blue-400 transition-colors">
            Home
          </Link>
          <Link to="/generate" className="hover:text-blue-400 transition-colors">
            Generate Form
          </Link>
          <Link to="/forms" className="hover:text-blue-400 transition-colors">
            All Forms
          </Link>
          {isLoggedIn ? (
            <>
              <Link to="/profile" className="hover:text-blue-400 transition-colors">
                Profile
              </Link>
              <button 
                onClick={handleLogout}
                className="hover:text-blue-400 transition-colors bg-transparent border-none cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/auth/signup" className="hover:text-blue-400 transition-colors">
                Signup
              </Link>
              <Link to="/auth/login" className="hover:text-blue-400 transition-colors">
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;