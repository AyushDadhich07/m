// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './page/landing';
import Signup from './page/signup_page';
import Login from './page/login_page';
// import Dashboard from './page/dashboard';
// import OtpVerify from './page/otpverify';
// import RegistrationSuccess from './page/registrationSuccess';
// import Leaderboard from './components/Leaderboard/Leaderboard.js';

// const PrivateRoute = ({ element: Element }) => {
//   const isAuthenticated = !!localStorage.getItem('token'); // Simplified authentication check
//   return isAuthenticated ? <Element /> : <Navigate to="/login" />;
// };

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />  
        <Route path="/login" element={<Login />} />
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