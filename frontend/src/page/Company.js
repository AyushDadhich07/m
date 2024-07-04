import React from 'react';
import Company from '../components/company.js';
import Widget from "../components/navbar.js";

function CompanyProfile() {
  return (
    <div className="App">
      <Widget/>
      <Company/>
    </div>
  );
}

export default CompanyProfile;