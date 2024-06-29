import React from 'react';
import QuestionList from '../components/QuestionList';

function Discussion() {
  return (
    <div className="App">
      <header className="bg-blue-600 p-4 text-white text-center">
        <h1>Discussion Forum</h1>
      </header>
      <main className="p-4">
        <QuestionList />
      </main>
    </div>
  );
}

export default Discussion;
