import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CompareCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Fetch initial companies data
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await axios.get('http://localhost:8000/company/profile/');
      setCompanies(response.data);
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/company/profile/search?q=${searchTerm}`);
      setCompanies(response.data);
    } catch (error) {
      console.error('Error searching companies:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Compare companies</h1>
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
          <CompanyCard key={company.id} company={company} />
        ))}
      </div>
    </div>
  );
};

const CompanyCard = ({ company }) => {
  return (
    <div className="border rounded p-4">
      <img src={`http://localhost:8000/media/${company.image}`} alt={company.name} className="w-16 h-16 mb-2" />
      <h2 className="text-xl font-semibold mb-2">{company.name}</h2>
      <p className="text-sm mb-2">{company.description}</p>
      <div className="text-sm">
        <p><strong>Founding Year:</strong> {company.founding_yr}</p>
        <p><strong>Type:</strong> {company.Type}</p>
        <p><strong>Tags:</strong> {company.tags}</p>
        <p><strong>Location:</strong> {company.Location}</p>
        <p><strong>Employees:</strong> {company.Employees}</p>
        <p><strong>Followers:</strong> {company.Followers}</p>
        <p><strong>Engagement:</strong> {company.Engagement}</p>
        <p><strong>Users:</strong> {company.Users}</p>
        <p><strong>Revenue:</strong> {company.Revenue}</p>
        <p><strong>Trademarks:</strong> {company.Trademarks}</p>
        <p><strong>Funding:</strong> {company.Funding}</p>
      </div>
    </div>
  );
};

export default CompareCompanies;
