import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';

const QuestionList = () => {
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newQuestionTitle, setNewQuestionTitle] = useState('');
  const [newQuestionContent, setNewQuestionContent] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [error, setError] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [expandedQuestions, setExpandedQuestions] = useState({});

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = questions.filter(question =>
      question.title.toLowerCase().includes(lowercasedQuery) ||
      question.content.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredQuestions(filtered);
  }, [searchQuery, questions]);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/questions/');
      setQuestions(response.data);
    } catch (error) {
      console.error("There was an error fetching the questions!", error);
    }
  };

  const handleQuestionSubmit = async () => {
    try {
      await axios.post('http://localhost:8000/api/questions/', {
        title: newQuestionTitle,
        content: newQuestionContent,
        user_email: localStorage.getItem('userEmail'),
      });
      setNewQuestionTitle('');
      setNewQuestionContent('');
      setError(null);
      fetchQuestions();
    } catch (error) {
      setError(error.response.data);
    }
  };

  const handleAnswerSubmit = async (questionId) => {
    try {
      await axios.post(`http://localhost:8000/api/questions/${questionId}/answers/`, {
        content: newAnswer,
        user_email: localStorage.getItem('userEmail'),
      });
      setNewAnswer('');
      setReplyingTo(null);
      fetchQuestions();
    } catch (error) {
      setError(error.response.data);
    }
  };

  const toggleReplies = (questionId) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Main content */}
      <main className="flex-1 p-6">
        {/* Header */}
        <header className="flex justify-between items-center mb-6">
          <div className="relative w-full max-w-xl">
            <input
              type="text"
              placeholder="Search for topics and discussions"
              className="w-full pl-10 pr-4 py-2 border rounded-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>
        </header>

        {/* Ask a Question section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Ask a Question</h2>
          <input
            className="w-full p-2 border rounded mb-2"
            value={newQuestionTitle}
            onChange={(e) => setNewQuestionTitle(e.target.value)}
            placeholder="Question title"
          />
          <textarea
            className="w-full p-2 border rounded mb-2"
            value={newQuestionContent}
            onChange={(e) => setNewQuestionContent(e.target.value)}
            placeholder="Question content"
            rows="4"
          />
          <button 
            className="px-4 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700"
            onClick={handleQuestionSubmit}
          >
            Submit Question
          </button>
          {error && <p className="text-red-500 mt-2">{JSON.stringify(error)}</p>}
        </section>

        {/* Discussions section */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Discussions</h2>
          {filteredQuestions.map((question) => (
            <div key={question.id} className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-center mb-4">
                <div>
                  <h3 className="font-bold">{question.user}</h3>
                  <p className="text-sm text-gray-500">{new Date(question.created_at).toLocaleString()}</p>
                </div>
              </div>
              <h4 className="text-xl font-bold mb-2">{question.title}</h4>
              <p className="mb-4">{question.content}</p>
              <div className="flex items-center space-x-4 mb-4">
                <button 
                  className="flex items-center space-x-1 text-gray-500 hover:text-gray-700"
                  onClick={() => toggleReplies(question.id)}
                >
                  <MessageCircle size={20} />
                  <span>{question.answers.length}</span>
                  {expandedQuestions[question.id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>
              {expandedQuestions[question.id] && (
                <>
                  {question.answers.map((answer) => (
                    <div key={answer.id} className="border-t pt-4 mb-4">
                      <div className="flex items-center mb-2">
                        <img src="/api/placeholder/32/32" alt="User avatar" className="w-8 h-8 rounded-full mr-2" />
                        <div>
                          <h5 className="font-bold">{answer.user}</h5>
                          <p className="text-sm text-gray-500">{new Date(answer.created_at).toLocaleString()}</p>
                        </div>
                      </div>
                      <p>{answer.content}</p>
                    </div>
                  ))}
                  {replyingTo === question.id ? (
                    <div className="mt-4">
                      <textarea
                        className="w-full p-2 border rounded mb-2"
                        value={newAnswer}
                        onChange={(e) => setNewAnswer(e.target.value)}
                        placeholder="Your answer"
                        rows="3"
                      />
                      <button
                        className="px-4 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 mr-2"
                        onClick={() => handleAnswerSubmit(question.id)}
                      >
                        Submit Answer
                      </button>
                      <button
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                        onClick={() => setReplyingTo(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      className="text-blue-600 font-bold hover:underline"
                      onClick={() => setReplyingTo(question.id)}
                    >
                      Reply
                    </button>
                  )}
                </>
              )}
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

export default QuestionList;