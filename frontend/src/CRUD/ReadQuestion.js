import React from 'react';

function ReadQuestion({ question }) {
  return (
    <div>
      <h2>Question Details</h2>
      <p>Category: {question.category}</p>
      <p>Title: {question.title}</p>
      <p>Options:</p>
      <ul>
        {question.options.map((option, index) => (
          <li key={index}>{option}</li>
        ))}
      </ul>
    </div>
  );
}

export default ReadQuestion;
