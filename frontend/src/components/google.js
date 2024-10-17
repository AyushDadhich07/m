import GoogleButton from "react-google-button";

const onGoogleLoginSuccess = () => {
  const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
  const REDIRECT_URI = 'auth/google/redirect';
  const state = btoa(Math.random().toString());

  const scope = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile'
  ].join(' ');

  const params = {
    response_type: 'code',
    client_id: "552806649066-4c54ijkubdbci729l5lmuc8ej6d0clsq.apps.googleusercontent.com",
    redirect_uri: `https://m-zbr0.onrender.com/api/${REDIRECT_URI}`,
    prompt: 'select_account',
    access_type: 'offline',
    scope,
    state
  };

  const urlParams = new URLSearchParams(params).toString();
  window.location = `${GOOGLE_AUTH_URL}?${urlParams}`;
};

const LoginButton = () => {
  return <GoogleButton onClick={onGoogleLoginSuccess}/>
}

export default LoginButton