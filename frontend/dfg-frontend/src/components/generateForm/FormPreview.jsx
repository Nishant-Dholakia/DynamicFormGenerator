// src/components/FormPreview.jsx
export default function FormPreview({ formData }) {
  const renderQuestion = (question) => {
    switch (question.answer_type) {
      case 'text':
      case 'email':
      case 'number':
      case 'password':
      case 'date':
        return (
          <input
            type={question.answer_type}
            id={question.questionid}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required={question.is_required}
            placeholder={question.placeholder}
            defaultValue={question.defaultValue}
          />
        )
      case 'textarea':
        return (
          <textarea
            id={question.questionid}
            rows={3}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required={question.is_required}
            placeholder={question.placeholder}
            defaultValue={question.defaultValue}
          ></textarea>
        )
      case 'select':
        return (
          <select
            id={question.questionid}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required={question.is_required}
            defaultValue={question.defaultValue}
          >
            <option value="">Select an option</option>
            {question.options.map((option, index) => (
              <option key={index} value={option.toLowerCase().replace(' ', '-')}>
                {option}
              </option>
            ))}
          </select>
        )
      case 'checkbox':
        return (
          <div className="space-y-2">
            {question.options.map((option, index) => (
              <div key={index} className="flex items-center">
                <input
                  type="checkbox"
                  id={`${question.questionid}-${index}`}
                  className="h-4 w-4 rounded bg-gray-700 border-gray-600 text-blue-600 focus:ring-blue-500"
                  value={option.toLowerCase().replace(' ', '-')}
                  defaultChecked={question.defaultValue === option}
                />
                <label htmlFor={`${question.questionid}-${index}`} className="ml-2 block text-sm text-gray-300">
                  {option}
                </label>
              </div>
            ))}
          </div>
        )
      case 'radio':
        return (
          <div className="space-y-2">
            {question.options.map((option, index) => (
              <div key={index} className="flex items-center">
                <input
                  type="radio"
                  id={`${question.questionid}-${index}`}
                  name={question.questionid}
                  className="h-4 w-4 bg-gray-700 border-gray-600 text-blue-600 focus:ring-blue-500"
                  value={option.toLowerCase().replace(' ', '-')}
                  required={question.is_required}
                  defaultChecked={question.defaultValue === option}
                />
                <label htmlFor={`${question.questionid}-${index}`} className="ml-2 block text-sm text-gray-300">
                  {option}
                </label>
              </div>
            ))}
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
      <h2 className="text-xl font-semibold mb-4 text-white">Form Preview</h2>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">{formData.title || 'Untitled Form'}</h3>
        {formData.category && <p className="text-sm text-gray-400">Category: {formData.category}</p>}
        
        <form className="space-y-4">
          {formData.questions.length === 0 ? (
            <p className="text-sm text-gray-400">No questions added yet</p>
          ) : (
            formData.questions
              .sort((a, b) => a.orderno - b.orderno)
              .map(question => (
                <div key={question.questionid} className="space-y-1">
                  <label htmlFor={question.questionid} className="block text-sm font-medium text-gray-300">
                    {question.question}
                    {question.is_required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {renderQuestion(question)}
                </div>
              ))
          )}
          
          {formData.questions.length > 0 && (
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition duration-200"
            >
              Submit Form
            </button>
          )}
        </form>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-medium text-white mb-2">Form Data Structure</h3>
        <pre className="bg-gray-900 p-3 rounded-md text-xs text-gray-300 overflow-x-auto">
          {JSON.stringify({
            ...formData,
            questions: formData.questions.map(q => ({
              ...q,
              // Remove temporary questionid for cleaner preview
              questionid: undefined,
              // Add other fields as needed
            }))
          }, null, 2)}
        </pre>
      </div>
    </div>
  )
}