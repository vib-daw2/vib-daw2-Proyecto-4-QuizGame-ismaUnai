import React, { useState } from 'react';

function UpdateQuestion({ question, onUpdate, onCancel }) {
  const [updatedQuestion, setUpdatedQuestion] = useState(question);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedQuestion({ ...updatedQuestion, [name]: value });
  };

  return (
    <div className="popup">
      <h2>Actualizar Pregunta</h2>
      <form onSubmit={() => onUpdate(updatedQuestion)}>
        <label>
          Categoría:
          <input
            type="text"
            name="category"
            value={updatedQuestion.category}
            onChange={handleChange}
          />
        </label>
        <label>
          Título:
          <input
            type="text"
            name="title"
            value={updatedQuestion.title}
            onChange={handleChange}
          />
        </label>
        <label>
          Opciones:
          {updatedQuestion.options.map((option, index) => (
            <input
              key={index}
              type="text"
              value={option}
              onChange={(e) => {
                const updatedOptions = [...updatedQuestion.options];
                updatedOptions[index] = e.target.value;
                setUpdatedQuestion({ ...updatedQuestion, options: updatedOptions });
              }}
            />
          ))}
        </label>
        <button type="submit">Actualizar</button>
      </form>
      <button onClick={onCancel}>Cancelar</button>
    </div>
  );
}

export default UpdateQuestion;
