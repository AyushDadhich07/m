import React from 'react';
import { GoogleLogin } from 'react-google-login';

const GoogleLoginComponent = () => {
  const handleLoginSuccess = (response) => {
    console.log('Login Success: currentUser:', response.profileObj);
    console.log('Login Success: token:', response.tokenId);

    // You can send the token to your backend server for further processing
    fetch('http://localhost:8000/accounts/google/login/token/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: response.tokenId }),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      // Handle successful authentication here
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };

  const handleLoginFailure = (response) => {
    console.log('Login Failed:', response);
  };

  return (
    <div>
      <GoogleLogin
        clientId="<your-client-id>"
        buttonText="Login with Google"
        onSuccess={handleLoginSuccess}
        onFailure={handleLoginFailure}
        cookiePolicy={'single_host_origin'}
      />
    </div>
  );
};

export default GoogleLoginComponent;
