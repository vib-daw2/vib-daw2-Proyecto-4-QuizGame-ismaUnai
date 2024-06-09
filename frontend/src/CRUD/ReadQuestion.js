//ReadQuestion.js
import React from 'react';

function ReadQuestion({ question }) {
  return (
    <div>
      <h2>Detalles de la pregunta</h2>
      <p>Categorias: {question.category}</p>
      <p>Titulo: {question.title}</p>
      <p>Opcoines:</p>
      <ul>
        {question.options.map((option, index) => (
          <li key={index}>{option}</li>
        ))}
      </ul>
    </div>
  );
}

export default ReadQuestion;
