import React from 'react';
import QuestionList from '../components/QuestionList';
import Widget from "../components/navbar.js";

function Discussion() {
  return (
    <div className="App">
      <Widget/>
      <main className="p-4">
        <QuestionList />
      </main>
    </div>
  );
}

export default Discussion;
