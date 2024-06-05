//UpdateQuestion.js
import React, { useState } from 'react';

function UpdateQuestion({ question, onUpdate, onCancel }) {
  const [updatedQuestion, setUpdatedQuestion] = useState({
    category: question.category,
    title: question.title,
    options: question.options.slice(),
    correctOptionIndex: question.correctOptionIndex,
  });

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    if (name === 'options') {
      const updatedOptions = [...updatedQuestion.options];
      updatedOptions[index] = value;
      setUpdatedQuestion({ ...updatedQuestion, options: updatedOptions });
    } else {
      setUpdatedQuestion({ ...updatedQuestion, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(updatedQuestion);
  };

  return (
    <div className="popup">
      <h2>Actualizar Pregunta</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Categoría:
          <input
            type="text"
            name="category"
            value={updatedQuestion.category}
            onChange={(e) => handleChange(e)}
          />
        </label>
        <label>
          Título:
          <input
            type="text"
            name="title"
            value={updatedQuestion.title}
            onChange={(e) => handleChange(e)}
          />
        </label>
        <label>
          Opciones:
          {updatedQuestion.options.map((option, index) => (
            <input
              key={index}
              type="text"
              name="options"
              value={option}
              onChange={(e) => handleChange(e, index)}
            />
          ))}
        </label>
        <label>
          Pregunta correcta (0-3):
          <input
            type="text"
            name="correctOptionIndex"
            value={updatedQuestion.correctOptionIndex}
            onChange={(e) => handleChange(e)}
          />
        </label>
        <button type="submit">Actualizar</button>
      </form>
      <button onClick={onCancel}>Cancelar</button>
    </div>
  );
}

export default UpdateQuestion;