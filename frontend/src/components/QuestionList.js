import React, { useState, useEffect } from 'react';
import axios from 'axios';

const QuestionList = () => {
  const [questions, setQuestions] = useState([]);
  const [newQuestionTitle, setNewQuestionTitle] = useState('');
  const [newQuestionContent, setNewQuestionContent] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [error, setError] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);

  useEffect(() => {
    fetchQuestions();
  }, []);

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
      const response = await axios.post('http://localhost:8000/api/questions/', {
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

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-4">
        <textarea
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
        />
        <button className="mt-2 p-2 bg-blue-500 text-white rounded" onClick={handleQuestionSubmit}>
          Submit Question
        </button>
        {error && <p className="text-red-500 mt-2">{JSON.stringify(error)}</p>}
      </div>
      <div>
        {questions.map((question) => (
          <div key={question.id} className="border-b p-2 mb-4">
            <h2 className="text-xl font-bold">{question.title}</h2>
            <p className="mb-2">{question.content}</p>
            <p className="text-sm text-gray-600">
              Asked by {question.user} on {new Date(question.created_at).toLocaleString()}
            </p>
            <div className="mt-4">
              <h3 className="font-semibold">Answers:</h3>
              {question.answers.map((answer) => (
                <div key={answer.id} className="ml-4 p-2 border-t">
                  <p>{answer.content}</p>
                  <p className="text-sm text-gray-600">
                    - {answer.user} on {new Date(answer.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
            {replyingTo === question.id ? (
              <div className="mt-4">
                <textarea
                  className="w-full p-2 border rounded mb-2"
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  placeholder="Your answer"
                />
                <button
                  className="p-2 bg-green-500 text-white rounded mr-2"
                  onClick={() => handleAnswerSubmit(question.id)}
                >
                  Submit Answer
                </button>
                <button
                  className="p-2 bg-gray-300 rounded"
                  onClick={() => setReplyingTo(null)}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                className="mt-2 p-2 bg-blue-500 text-white rounded"
                onClick={() => setReplyingTo(question.id)}
              >
                Reply
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionList;