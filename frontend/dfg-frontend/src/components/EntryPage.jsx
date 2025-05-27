import { Link } from "react-router-dom";

function EntryPage() {
  return (
    <section className="bg-gradient-to-b from-gray-900 to-gray-700 text-white min-h-[80vh] flex items-center justify-center">
      <div className="container mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Create Smart, Dynamic Forms in Seconds
        </h1>
        <p className="text-gray-300 text-lg md:text-xl mb-8">
          Generate, manage, and access all your forms with ease and flexibility.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/generate"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-lg"
          >
            🚀 Generate Form
          </Link>
          <Link
            to="/forms"
            className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition text-lg"
          >
            📁 View Your Forms
          </Link>
        </div>
      </div>
    </section>
  );
}

export default EntryPage;
