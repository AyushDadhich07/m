import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const GoogleAuth = () => {
  const responseGoogle = (credentialResponse) => {
    console.log(credentialResponse);
    axios.post('http://localhost:8000/api/auth/google/', {
      credential: credentialResponse.credential,
    })
    .then(res => {
      console.log(res.data);
    })
    .catch(err => {
      console.log(err);
    });
  };

  return (
    <div>
      <GoogleLogin
        onSuccess={responseGoogle}
        onError={() => {
          console.log('Login Failed');
        }}
        useOneTap
      />
    </div>
  );
}

export default GoogleAuth;