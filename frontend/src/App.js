// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './page/landing';
import Signup from './page/signup_page';
import Login from './page/login_page';
import Support from './page/support';
import Profile from './page/profile';
import DocumentsPage from './page/documents_page';
import Discussion from './page/discussion'; 
import Home from './page/home'; 
import AnswerQuestionsPage from './page/AnswerQuestionsPage';
import Company from './page/Company';
import PrivacyPolicy from './page/privacyPolicy';
import Glossary from './page/glossary';
// import Dashboard from './page/dashboard';
// import OtpVerify from './page/otpverify';
// import RegistrationSuccess from './page/registrationSuccess';
// import Leaderboard from './components/Leaderboard/Leaderboard.js';

const PrivateRoute = ({ element: Element }) => {
  const isAuthenticated = !!localStorage.getItem('token'); // Simplified authentication check
  return isAuthenticated ? <Element /> : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />  
        <Route path="/login" element={<Login />} />
        <Route path="/support" element={<Support />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/home" element={<Home/>} />
        <Route path="/documentpage" element={<PrivateRoute element={DocumentsPage} />} />
        <Route path="/discussion" element={<PrivateRoute element={Discussion}/>}/>
        <Route path="/answer-questions" element={<PrivateRoute element={AnswerQuestionsPage} />} />
        <Route path="/company" element={<PrivateRoute element={Company} />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/glossary" element={<Glossary />} />
        {/* <Route path="/otpVerify" element={<OtpVerify />} /> */}
        {/* <Route path="/dashboard" element={<PrivateRoute element={Dashboard} />} /> */}
        {/* <Route path="/registrationSuccess" element={<PrivateRoute element={RegistrationSuccess} />} /> */}
        {/* <Route path="/Leaderboard" element={<Leaderboard />} /> */}
        {/* <Route path="/registrationSuccess" element={<RegistrationSuccess/>}></Route>  */}
      </Routes>
    </Router>
  );
}

export default App;