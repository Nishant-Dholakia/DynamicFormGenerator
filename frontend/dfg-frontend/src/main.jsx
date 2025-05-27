import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import EntryPage from './components/EntryPage.jsx'
import SignupPage from './components/SignupPage.jsx'


const router = createBrowserRouter(
  createRoutesFromElements(
  
    <Route path='/' element={<App/>}>
        <Route path='' element={<EntryPage/>} />
        <Route path='signup' element={<SignupPage/>} />

    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router = {router} />
  </StrictMode>,
)
