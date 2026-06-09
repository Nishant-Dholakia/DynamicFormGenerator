// src/App.jsx
import { useState, useContext } from 'react'

import { saveForm } from '../services/FormService'
import { AuthContext } from '../context/AuthContext'
import FormBuilder from './FormBuilder'
import FormPreview from './FormPreview'


function App() {
  const { user, isLoggedIn, isLoading } = useContext(AuthContext)
  
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    questions: [],
    isActive: true
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState(null)

  const handleCreateForm = async () => {
    // Check if user is logged in
    if (!isLoggedIn || !user) {
      setSubmitMessage({ type: 'error', text: 'Please log in to create forms' })
      return
    }

    if (!formData.title) {
      setSubmitMessage({ type: 'error', text: 'Form title is required' })
      return
    }

    if (formData.questions.length === 0) {
      setSubmitMessage({ type: 'error', text: 'Please add at least one question' })
      return
    }

    setIsSubmitting(true)
    setSubmitMessage(null)

    try {
      // Use the actual user ID from the auth context
      const result = await saveForm(formData, user.id)
      setSubmitMessage({ type: 'success', text: 'Form created successfully!' })
      console.log('Form saved:', result)
      // Optionally reset form after successful submission
      // setFormData({
      //   title: '',
      //   category: '',
      //   questions: [],
      //   isActive: true
      // })
    } catch (error) {
      setSubmitMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to save form'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-700 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  // Show login prompt if user is not authenticated
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-700 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Please Log In</h2>
          <p className="text-gray-300">You need to be logged in to access the form generator.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-700 p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">React Form Generator</h1>
        {user && (
          <div className="text-white">
            <span className="text-gray-300">Welcome, </span>
            <span className="font-medium">{user.username || user.name}</span>
          </div>
        )}
      </div>
      
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FormBuilder formData={formData} setFormData={setFormData} />
        <FormPreview formData={formData} />
      </div>

      <div className="fixed bottom-6 right-6">
        <button
          onClick={handleCreateForm}
          disabled={isSubmitting}
          className={`px-6 py-3 rounded-lg shadow-lg font-medium text-white transition-all
            ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating...
            </span>
          ) : 'Create Form'}
        </button>
      </div>

      {submitMessage && (
        <div className={`fixed top-6 right-6 p-4 rounded-lg shadow-lg text-white
          ${submitMessage.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}
        >
          {submitMessage.text}
        </div>
      )}
    </div>
  )
}

export default App