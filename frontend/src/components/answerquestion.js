import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import * as XLSX from 'xlsx';

const AnswerQuestionsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedDocuments } = location.state;
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [predefinedQuestions, setPredefinedQuestions] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchPredefinedQuestions = async () => {
      try {
        const response = await axios.get('https://m-zbr0.onrender.com/api/predefinedQuestion/');
        // const response = await axios.get('http://localhost:8000/api/predefinedQuestion/');
        setPredefinedQuestions(response.data);
      } catch (error) {
        console.error('Error fetching predefined questions:', error);
      }
    };

    fetchPredefinedQuestions();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const headerRow = jsonData[0];
      const questionColumnIndex = headerRow.findIndex(
        (header) => header.toLowerCase() === 'question'
      );

      if (questionColumnIndex === -1) {
        console.error('No "Questions" column found in the Excel file');
        return;
      }

      const extractedQuestions = jsonData
        .slice(1)
        .map((row) => row[questionColumnIndex])
        .filter((question) => question);

      console.log('Extracted Questions:', extractedQuestions);
      setQuestions(extractedQuestions);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log(selectedDocuments);
      const response = await axios.post('https://m-zbr0.onrender.com/api/answer-question/', {
        question,
        documentIds: selectedDocuments,
      });
      // const response = await axios.post('http://localhost:8000/api/answer-question/', {
      //   question,
      //   documentIds: selectedDocuments,
      // });
      setAnswer(response.data.answer);
    } catch (error) {
      console.error('Error getting answer:', error);
      setAnswer(error.response?.data?.error || 'An error occurred while processing your question.');
    }
    setLoading(false);
  };

  const handlePredefinedQuestionClick = async (predefinedQuestion) => {
    setQuestion(predefinedQuestion);
    setLoading(true);
    try {
      const response = await axios.post('https://m-zbr0.onrender.com/api/answer-question/', {
        question: predefinedQuestion,
        documentIds: selectedDocuments,
      });
      // const response = await axios.post('http://localhost:8000/api/answer-question/', {
      //   question: predefinedQuestion,
      //   documentIds: selectedDocuments,
      // });
      setAnswer(response.data.answer);
    } catch (error) {
      console.error('Error getting answer:', error);
      setAnswer(error.response?.data?.error || 'An error occurred while processing your question.');
    }
    setLoading(false);
  };

  const handleExcelQuestionsSubmit = async () => {
    if (questions.length === 0) return;
    setLoading(true);
    setAnswers([]);

    for (const question of questions) {
      try {
        const response = await axios.post('https://m-zbr0.onrender.com/api/answer-question/', {
          question,
          documentIds: selectedDocuments,
        });
        // const response = await axios.post('http://localhost:8000/api/answer-question/', {
        //   question,
        //   documentIds: selectedDocuments,
        // });
        setAnswers((prevAnswers) => [
          ...prevAnswers,
          { question, answer: response.data.answer },
        ]);
      } catch (error) {
        console.error('Error getting answer:', error);
        setAnswers((prevAnswers) => [
          ...prevAnswers,
          { question, answer: error.response?.data?.error || 'An error occurred while processing your question.' },
        ]);
      }
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#343541] text-white overflow-hidden">
      {/* Sidebar */}
      <div className={`md:w-64 bg-[#40414F] shadow-md flex flex-col ${sidebarOpen ? 'fixed inset-y-0 left-0 z-50' : 'hidden md:flex'}`}>
        <div className="p-4 border-b border-[#4A4A4A] flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Project_M</h1>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="flex-grow overflow-y-auto p-6">
          <ul className="space-y-2">
            {predefinedQuestions.map((q) => (
              <li key={q.id}>
                <button 
                  onClick={() => handlePredefinedQuestionClick(q.question)}
                  className="flex items-center space-x-2 text-white hover:bg-[#565869] rounded p-2 w-full text-left"
                >
                  {q.question}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile header */}
        <div className="md:hidden p-4 bg-[#40414F] flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Project_M</h1>
          <button onClick={() => setSidebarOpen(true)} className="text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <h1 className="text-2xl font-bold mb-6 text-white">Answer Questions</h1>

          {answer && (
            <div className="bg-[#40414F] p-4 rounded-md mb-6 border border-[#565869]">
              <h2 className="font-bold mb-2 text-white">Answer:</h2>
              <ReactMarkdown className="text-[#E3E3E3]">{answer}</ReactMarkdown>
            </div>
          )}

          {answers.length > 0 && (
            <div className="bg-[#40414F] p-4 md:p-6 rounded-md border border-[#565869]">
              <h2 className="text-xl font-bold mb-4 text-white">Answers from Excel:</h2>
              {answers.map((item, index) => (
                <div key={index} className="mb-6 last:mb-0 bg-[#4A4B59] p-4 rounded-md">
                  <p className="text-[#E3E3E3] font-semibold mb-2">
                    <span className="text-[#10A37F]">Question:</span> {item.question}
                  </p>
                  <div className="text-[#E3E3E3] pl-4 border-l-2 border-[#10A37F]">
                    <ReactMarkdown>{item.answer}</ReactMarkdown>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Fixed input area */}
        <div className="bg-[#40414F] p-4 border-t border-[#4A4A4A]">
          <form onSubmit={handleQuestionSubmit} className="flex flex-col space-y-4">
            <div className="flex flex-col md:flex-row items-stretch md:items-center space-y-2 md:space-y-0 md:space-x-4">
              <textarea
                className="flex-grow p-2 border rounded-md bg-[#343541] text-white border-[#565869] resize-none"
                rows="2"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Enter your question here..."
              ></textarea>
              <button
                type="submit"
                className={`px-4 py-2 rounded-md ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#10A37F] hover:bg-[#0B8C6E]'} text-white`}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Submit'}
              </button>
            </div>
            <div className="flex flex-col md:flex-row items-stretch md:items-center space-y-2 md:space-y-0 md:space-x-4">
              <input 
                type="file" 
                accept=".xlsx, .xls" 
                onChange={handleFileChange}
                className="flex-grow bg-[#40414F] text-white"
              />
              <button
                type="button"
                onClick={handleExcelQuestionsSubmit}
                className={`px-4 py-2 rounded-md ${loading || questions.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#10A37F] hover:bg-[#0B8C6E]'} text-white`}
                disabled={loading || questions.length === 0}
              >
                {loading ? 'Processing...' : 'Submit Excel'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AnswerQuestionsPage;