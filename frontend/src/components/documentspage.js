import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const DocumentsPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const userEmail = localStorage.getItem('userEmail');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDocuments();
  }, [userEmail]);

  const fetchDocuments = async () => {
    try {
      const response = await axios.get(`https://m-zbr0.onrender.com/api/documents/?userEmail=${userEmail}`);
      setDocuments(JSON.parse(response.data));
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('user_id', userEmail);

    setUploading(true);
    try {
      const response = await axios.post('https://m-zbr0.onrender.com/api/documents/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
      fetchDocuments();
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      fetchDocuments();
      setUploading(false);
    }
  };

  const handleDocumentSelection = (docId) => {
    setSelectedDocuments((prev) =>
      prev.includes(docId) ? prev.filter((id) => id !== docId) : [...prev, docId]
    );
  };

  const handleAnswerQuestions = () => {
    if (selectedDocuments.length > 0) {
      navigate('/answer-questions', { state: { selectedDocuments } });
    }
  };

  const handleDeleteDocument = async (docId) => {
    try {
      await axios.delete(`https://m-zbr0.onrender.com/api/documents/${docId}/`);
      fetchDocuments(); // Refresh the document list
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-white shadow-md">
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
              <button
              onClick={handleAnswerQuestions}
              disabled={selectedDocuments.length === 0}
              className={`w-full px-4 py-2 rounded-md ${selectedDocuments.length > 0 ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
            >
              Answer Questions
            </button>
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

      {/* Main content */}
      <div className="flex-1 overflow-auto p-4 md:p-8">
        <header className="bg-white shadow-sm mb-6">
          <div className="max-w-full mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <h2 className="text-lg font-semibold text-gray-900">All documents</h2>
          </div>
        </header>

        <main className="max-w-full mx-auto">
          <h1 className="text-3xl font-bold mb-6">Documents</h1>
          
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <input 
              type="file" 
              onChange={handleFileChange} 
              className="mb-4 w-full"
            />
            <button
              onClick={handleFileUpload}
              disabled={uploading}
              className={`w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {uploading ? 'Uploading...' : 'Upload Document'}
            </button>
          </div>

          {documents.length > 0 ? (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Select</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {documents.map((doc) => (
                    <tr key={doc.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input 
                          type="checkbox" 
                          checked={selectedDocuments.includes(doc.id)}
                          onChange={() => handleDocumentSelection(doc.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{doc.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${doc.processed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {doc.processed ? 'Ready to use' : 'Processing'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{new Date(doc.upload_date).toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleDeleteDocument(doc.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No documents found</p>
          )}
        </main>
      </div>
    </div>
  );
};

export default DocumentsPage;
