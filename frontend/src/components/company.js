import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CompareCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      // const response = await axios.get('https://m-zbr0.onrender.com/company/profile/');
      const response = await axios.get('https://localhost:8000/company/profile/');
      setCompanies(response.data);
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  const handleSearch = async () => {
    try {
      // const response = await axios.get(`https://m-zbr0.onrender.com/company/profile/search?q=${searchTerm}`);
      const response = await axios.get(`http://localhost:8000/company/profile/search?q=${searchTerm}`);
      setCompanies(response.data);
    } catch (error) {
      console.error('Error searching companies:', error);
    }
  };

  const handleSelectCompany = (company) => {
    setSelectedCompanies((prevSelected) => {
      if (prevSelected.includes(company)) {
        return prevSelected.filter((c) => c.id !== company.id);
      } else if (prevSelected.length < 3) {
        return [...prevSelected, company];
      } else {
        return prevSelected; // Do not add more than 3 companies
      }
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Compare Companies</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Add company..."
          className="border rounded px-2 py-1 mr-2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-1 rounded"
        >
          Search
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {companies.map((company) => (
          <div
            key={company.id}
            className={`border rounded shadow p-4 cursor-pointer ${selectedCompanies.includes(company) ? 'bg-blue-100' : ''}`}
            onClick={() => handleSelectCompany(company)}
          >
            <div className="flex items-center">
              <img src={`http://localhost:8000/media/${company.image}`} alt={company.name} className="w-16 h-16 mr-4" />
              <h2 className="text-xl font-semibold">{company.name}</h2>
            </div>
          </div>
        ))}
      </div>
      {selectedCompanies.length > 0 && (
        <div className="overflow-x-auto mt-8">
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="px-4 py-2">Attribute</th>
                {selectedCompanies.map((company) => (
                  <th key={company.id} className="px-4 py-2">{company.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-4 py-2"><strong>Description</strong></td>
                {selectedCompanies.map((company) => (
                  <td key={company.id} className="border px-4 py-2">{company.description}</td>
                ))}
              </tr>
              <tr>
                <td className="border px-4 py-2"><strong>Founding Year</strong></td>
                {selectedCompanies.map((company) => (
                  <td key={company.id} className="border px-4 py-2">{company.founding_yr}</td>
                ))}
              </tr>
              <tr>
                <td className="border px-4 py-2"><strong>Type</strong></td>
                {selectedCompanies.map((company) => (
                  <td key={company.id} className="border px-4 py-2">{company.Type}</td>
                ))}
              </tr>
              <tr>
                <td className="border px-4 py-2"><strong>Tags</strong></td>
                {selectedCompanies.map((company) => (
                  <td key={company.id} className="border px-4 py-2">{company.tags}</td>
                ))}
              </tr>
              <tr>
                <td className="border px-4 py-2"><strong>Location</strong></td>
                {selectedCompanies.map((company) => (
                  <td key={company.id} className="border px-4 py-2">{company.Location}</td>
                ))}
              </tr>
              <tr>
                <td className="border px-4 py-2"><strong>Employees</strong></td>
                {selectedCompanies.map((company) => (
                  <td key={company.id} className="border px-4 py-2">{company.Employees}</td>
                ))}
              </tr>
              <tr>
                <td className="border px-4 py-2"><strong>Followers</strong></td>
                {selectedCompanies.map((company) => (
                  <td key={company.id} className="border px-4 py-2">{company.Followers}</td>
                ))}
              </tr>
              <tr>
                <td className="border px-4 py-2"><strong>Engagement</strong></td>
                {selectedCompanies.map((company) => (
                  <td key={company.id} className="border px-4 py-2">{company.Engagement}</td>
                ))}
              </tr>
              <tr>
                <td className="border px-4 py-2"><strong>Users</strong></td>
                {selectedCompanies.map((company) => (
                  <td key={company.id} className="border px-4 py-2">{company.Users}</td>
                ))}
              </tr>
              <tr>
                <td className="border px-4 py-2"><strong>Revenue</strong></td>
                {selectedCompanies.map((company) => (
                  <td key={company.id} className="border px-4 py-2">{company.Revenue}</td>
                ))}
              </tr>
              <tr>
                <td className="border px-4 py-2"><strong>Trademarks</strong></td>
                {selectedCompanies.map((company) => (
                  <td key={company.id} className="border px-4 py-2">{company.Trademarks}</td>
                ))}
              </tr>
              <tr>
                <td className="border px-4 py-2"><strong>Funding</strong></td>
                {selectedCompanies.map((company) => (
                  <td key={company.id} className="border px-4 py-2">{company.Funding}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CompareCompanies;
