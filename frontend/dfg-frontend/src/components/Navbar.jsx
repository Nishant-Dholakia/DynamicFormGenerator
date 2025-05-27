
// File: src/components/Navbar.jsx
import { Link } from "react-router-dom";

function Navbar() {
    return(
   <nav className="bg-gray-800 text-white py-4 shadow-md">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-white hover:text-blue-400 transition-colors">
          Dynamic Form Generator
        </Link>
        <div className="space-x-6 text-sm sm:text-base">
          <Link
            to="/"
            className="hover:text-blue-400 transition-colors"
          >
            Home
          </Link>
          <Link
            to="/generate"
            className="hover:text-blue-400 transition-colors"
          >
            Generate Form
          </Link>
          <Link
            to="/forms"
            className="hover:text-blue-400 transition-colors"
          >
            All Forms
          </Link>
          <Link
            to="/signup"
            className="hover:text-blue-400 transition-colors"
          >
            Signup
          </Link>
        </div>
      </div>
    </nav>
);
}

export default Navbar;
