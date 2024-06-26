import React, { useState } from 'react';
import axios from 'axios';

const DocumentsPage = ({ user_id }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };
  const userEmail=localStorage.getItem('userEmail');
  const handleFileUpload = async () => {
    if (!selectedFile) return;
    console.log(userEmail);
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('user_id', userEmail);

    try {
      const response = await axios.post('http://localhost:8000/api/documents/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h1 className="text-2xl font-bold">briink</h1>
        </div>
        <nav className="mt-6">
          <button className="w-full flex items-center p-4 text-gray-700 hover:bg-gray-200">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create new
          </button>
          <a href="#" className="block p-4 text-gray-700 hover:bg-gray-200">Questionnaires</a>
          <a href="#" className="block p-4 text-gray-700 hover:bg-gray-200">Document chats</a>
          <a href="#" className="block p-4 text-gray-700 hover:bg-gray-200">Policy assessments</a>
          <a href="#" className="block p-4 text-blue-600 font-semibold">Documents</a>
          <a href="#" className="block p-4 text-gray-700 hover:bg-gray-200">Help</a>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-lg font-semibold text-gray-900">Home</h2>
              <span className="mx-2 text-gray-500">&gt;</span>
              <h2 className="text-lg font-semibold text-gray-900">All documents</h2>
            </div>
            <button className="p-2 rounded-full hover:bg-gray-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-6">Documents</h1>
          
          <div className="bg-white p-6 rounded-lg border-2 border-dashed border-gray-300 mb-6">
            <div className="flex justify-between items-center mb-4">
              <input type="file" onChange={handleFileChange} />
              <button
                className="bg-black text-white px-4 py-2 rounded-full flex items-center"
                onClick={handleFileUpload}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Upload documents
              </button>
            </div>
            <p className="text-center text-gray-500">...or drag'n drop documents here</p>
          </div>

          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left pb-2">Name</th>
                <th className="text-right pb-2">Status</th>
                <th className="text-right pb-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {['henkel-social-standards-aug-2023.pdf', 'henkel-2022-sustainability-report.pdf'].map((doc, index) => (
                <tr key={index} className="border-b">
                  <td className="py-4 flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <svg className="w-6 h-6 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                    </svg>
                    {doc}
                  </td>
                  <td className="py-4 text-right">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">Ready to use</span>
                  </td>
                  <td className="py-4 text-right">Today at 14:59</td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
      </div>
    </div>
  );
};

export default DocumentsPage;
