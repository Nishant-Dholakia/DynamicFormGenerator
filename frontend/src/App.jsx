
import './App.css'
import { AuthProvider } from './components/context/AuthContext';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Outlet />
      <Footer />
    </AuthProvider>
  );
}

export default App;


