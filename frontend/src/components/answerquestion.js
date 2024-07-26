import React, { useState } from 'react';
import { useLocation, useNavigate,Link } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

const AnswerQuestionsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedDocuments } = location.state;
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/answer-question/', {
        question,
        documentIds: selectedDocuments,
      });
      setAnswer(response.data.answer);
    } catch (error) {
      console.error('Error getting answer:', error);
      setAnswer(error.response?.data?.error || 'An error occurred while processing your question.');
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
     <div className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h1 className="text-2xl font-bold">Project_M</h1>
        </div>
        <aside className="w-full md:w-64 bg-white p-6 border-r">
          <nav>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/documentpage" 
                  className="flex items-center space-x-2 text-gray-700 hover:bg-gray-100 rounded p-2"
                >
                  Documents
                </Link>
              </li>
              <li>
                <Link 
                  to="/support" 
                  className="flex items-center space-x-2 text-gray-700 hover:bg-gray-100 rounded p-2"
                >
                  Help
                </Link>
              </li>
            </ul>
          </nav>
        </aside>
      </div>


      <div className="w-8xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">Answer Questions</h1>
        <form onSubmit={handleQuestionSubmit} className="mb-6">
          <textarea
            className="w-full p-2 border rounded-md mb-4"
            rows="3"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter your question here..."
          ></textarea>
          <button
            type="submit"
            className={`px-4 py-2 rounded-md ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Submit Question'}
          </button>
        </form>
        {answer && (
          <div className="bg-gray-50 p-4 rounded-md">
            <h2 className="font-bold mb-2">Answer:</h2>
            <ReactMarkdown>{answer}</ReactMarkdown>
          </div>
        )}
        <button
          onClick={() => navigate('/documentpage')}
          className="mt-4 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
        >
          Back to Documents
        </button>
      </div>
    </div>
  );
};

export default AnswerQuestionsPage;