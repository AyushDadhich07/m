import React, { useState, useEffect } from 'react';
import axios from 'axios';

const QuestionList = () => {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    const response = await axios.get('http://localhost:8000/api/questions/');
    setQuestions(response.data);
  };

  const handleQuestionSubmit = async () => {
    await axios.post('http://localhost:8000/api/questions/', { title: newQuestion });
    setNewQuestion('');
    fetchQuestions();
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-4">
        <textarea
          className="w-full p-2 border rounded"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          placeholder="Ask a question"
        />
        <button className="mt-2 p-2 bg-blue-500 text-white rounded" onClick={handleQuestionSubmit}>
          Submit
        </button>
      </div>
      <div>
        {questions.map((question) => (
          <div key={question.id} className="border-b p-2">
            <h2 className="text-xl">{question.title}</h2>
            <p>{question.content}</p>
            <div>
              {question.answers.map((answer) => (
                <div key={answer.id} className="ml-4 p-2 border-t">
                  <p>{answer.content}</p>
                  <p className="text-sm text-gray-600">- {answer.user}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionList;
