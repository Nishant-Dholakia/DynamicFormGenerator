import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import EntryPage from './components/EntryPage.jsx'
import SignupPage from './components/auth/SignupPage.jsx'
import LoginPage from './components/auth/LoginPage.jsx'


const router = createBrowserRouter(
  createRoutesFromElements(
  
    <Route path='/' element={<App/>}>
        <Route path='' element={<EntryPage/>} />
        <Route path='auth/signup' element={<SignupPage/>} />
        <Route path='auth/login' element={<LoginPage/>} />

    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router = {router} />
  </StrictMode>,
)
