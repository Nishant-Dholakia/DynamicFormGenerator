// src/components/FormBuilder.jsx
import { useState } from 'react'

const fieldTypes = [
  { value: 'text', label: 'Text Input' },
  { value: 'email', label: 'Email Input' },
  { value: 'number', label: 'Number Input' },
  { value: 'password', label: 'Password Input' },
  { value: 'textarea', label: 'Text Area' },
  { value: 'select', label: 'Dropdown' },
  { value: 'checkbox', label: 'Checkbox Group' },
  { value: 'radio', label: 'Radio Group' },
  { value: 'date', label: 'Date Picker' },
]

export default function FormBuilder({ formData, setFormData }) {
  const [currentQuestion, setCurrentQuestion] = useState({
    question: '',
    answer_type: 'text',
    is_required: false,
    options: [],
    placeholder: '',
    defaultValue: '',
    orderno: formData.questions.length + 1
  })

  const [newOption, setNewOption] = useState('')

  const handleAddOption = () => {
    if (!newOption.trim()) return;
    if(newOption in currentQuestion.options) 
      {
        console.log(newOption," - repeated")
        return;
      }
    setCurrentQuestion(prev => ({
      ...prev,
      options: [...prev.options, newOption.trim()]
    }))
    setNewOption('')
  }

  const handleRemoveOption = (index) => {
    setCurrentQuestion(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index)
    }))
  }

  const handleAddQuestion = () => {
    if (!currentQuestion.question) {
      alert('Please enter a question')
      return
    }

    const newQuestion = {
      questionid: `question-${Date.now()}`,
      question: currentQuestion.question,
      answer_type: currentQuestion.answer_type,
      is_required: currentQuestion.is_required,
      options: currentQuestion.answer_type === 'select' || 
               currentQuestion.answer_type === 'checkbox' || 
               currentQuestion.answer_type === 'radio' 
        ? [...currentQuestion.options] 
        : [],
      placeholder: currentQuestion.placeholder,
      defaultValue: currentQuestion.defaultValue,
      orderno: currentQuestion.orderno,
      validations: {}, // Add empty validations object to match your Java entity
      form: null // This will be set by the backend
    }

    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }))

    // Reset current question but increment order number
    setCurrentQuestion({
      question: '',
      answer_type: 'text',
      is_required: false,
      options: [],
      placeholder: '',
      defaultValue: '',
      orderno: currentQuestion.orderno + 1
    })
  }

   //function to handle question reordering
  const handleQuestionOrderChange = (questionId, newOrder) => {
    setFormData(prev => {
      const updatedQuestions = [...prev.questions]
      const questionIndex = updatedQuestions.findIndex(q => q.questionid === questionId)
      
      if (questionIndex !== -1) {
        updatedQuestions[questionIndex].orderno = newOrder
        // Sort questions by orderno
        updatedQuestions.sort((a, b) => a.orderno - b.orderno)
        return { ...prev, questions: updatedQuestions }
      }
      return prev
    })
  }

  const handleRemoveQuestion = (questionid) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.questionid !== questionid)
    }))
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
      <h2 className="text-xl font-semibold mb-4 text-white">Form Builder</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Form Title</label>
          <input
            type="text"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
          <input
            type="text"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
          />
        </div>

        <div className="border-t border-gray-700 pt-4 mt-4">
          <h3 className="text-lg font-medium text-white mb-2">Add Question</h3>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Question Text</label>
            <input
              type="text"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={currentQuestion.question}
              onChange={(e) => setCurrentQuestion(prev => ({ ...prev, question: e.target.value }))}
            />
          </div>

          <div className="mt-3">
            <label className="block text-sm font-medium text-gray-300 mb-1">Answer Type</label>
            <select
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={currentQuestion.answer_type}
              onChange={(e) => setCurrentQuestion(prev => ({ ...prev, answer_type: e.target.value }))}
            >
              {fieldTypes.map(type => (
                <option key={type.value} value={type.value} className="bg-gray-800">{type.label}</option>
              ))}
            </select>
          </div>

          {(currentQuestion.answer_type === 'select' || currentQuestion.answer_type === 'checkbox' || currentQuestion.answer_type === 'radio') && (
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-300 mb-1">Options</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddOption()}
                  placeholder="Enter option and press Add"
                />
                <button
                  onClick={handleAddOption}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-200"
                >
                  Add
                </button>
              </div>

              {currentQuestion.options.length > 0 && (
                <div className="mt-2 space-y-1">
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-700 px-3 py-2 rounded">
                      <span className="text-gray-200">{option}</span>
                      <button
                        onClick={() => handleRemoveOption(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex items-center mt-3">
            <input
              type="checkbox"
              id="required"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
              checked={currentQuestion.is_required}
              onChange={(e) => setCurrentQuestion(prev => ({ ...prev, is_required: e.target.checked }))}
            />
            <label htmlFor="required" className="ml-2 block text-sm text-gray-300">Required question</label>
          </div>

          <div className="mt-3">
            <label className="block text-sm font-medium text-gray-300 mb-1">Placeholder (optional)</label>
            <input
              type="text"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={currentQuestion.placeholder}
              onChange={(e) => setCurrentQuestion(prev => ({ ...prev, placeholder: e.target.value }))}
            />
          </div>

          <div className="mt-3">
            <label className="block text-sm font-medium text-gray-300 mb-1">Default Value (optional)</label>
            <input
              type="text"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={currentQuestion.defaultValue}
              onChange={(e) => setCurrentQuestion(prev => ({ ...prev, defaultValue: e.target.value }))}
            />
          </div>

          <button
            onClick={handleAddQuestion}
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-200"
          >
            Add Question
          </button>
        </div>

        <div className="mt-6 space-y-3">
          <h3 className="text-lg font-medium text-white">Current Questions</h3>
          {formData.questions.length === 0 ? (
            <p className="text-sm text-gray-400">No questions added yet</p>
          ) : (
            <ul className="space-y-2">
              {formData.questions.map((question, index) => (
                <li key={question.questionid} className="flex justify-between items-start p-3 bg-gray-700 rounded-md">
                  <div>
                    <div className="font-medium text-gray-100">{question.question}</div>
                    <div className="flex gap-2 mt-1">
                      <span className="text-xs px-2 py-1 bg-gray-600 text-gray-200 rounded">{question.answer_type}</span>
                      {question.is_required && <span className="text-xs px-2 py-1 bg-red-900 text-red-200 rounded">Required</span>}
                      <span className="text-xs px-2 py-1 bg-gray-600 text-gray-200 rounded">Order: {question.orderno}</span>
                    </div>
                    {question.options.length > 0 && (
                      <div className="mt-2">
                        <span className="text-xs text-gray-400">Options:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {question.options.map((opt, i) => (
                            <span key={i} className="text-xs px-2 py-1 bg-gray-600 text-gray-200 rounded">
                              {opt}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleRemoveQuestion(question.questionid)}
                    className="text-red-400 hover:text-red-300 text-sm font-medium"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}