import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

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
      setAnswer('An error occurred while processing your question.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
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
            <h2 className="font-semibold mb-2">Answer:</h2>
            <p>{answer}</p>
          </div>
        )}
        <button
          onClick={() => navigate('/documents')}
          className="mt-4 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
        >
          Back to Documents
        </button>
      </div>
    </div>
  );
};

export default AnswerQuestionsPage;