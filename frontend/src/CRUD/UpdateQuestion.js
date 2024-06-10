// UpdateQuestion.js
import React, { useState } from 'react';
import axios from 'axios';

const UpdateQuestion = ({ question, onUpdate, onCancel }) => {
  const initialFormData = {
    category: question?.category || '',
    title: question?.title || '',
    options: question?.options || [],
    correctOptionIndex: question?.correctOptionIndex?.toString() || ''
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (e, index = null) => {
    const { name, value } = e.target;
    if (name === 'options' && index !== null) {
      const updatedOptions = [...formData.options];
      updatedOptions[index] = value;
      setFormData({ ...formData, options: updatedOptions });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const index = parseInt(formData.correctOptionIndex);
      if (!isNaN(index)) {
        await axios.put(`http://localhost:4000/api/questions/${question._id}`, formData);
        onUpdate({ ...question, ...formData });
      } else {
        console.error('El índice de la respuesta correcta debe ser un número.');
      }
    } catch (error) {
      console.error('Error updating question:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Categoría:
          <input type="text" name="category" value={formData.category} onChange={handleChange} />
        </label>
      </div>
      <div>
        <label>
          Título:
          <input type="text" name="title" value={formData.title} onChange={handleChange} />
        </label>
      </div>
      {formData.options.map((option, index) => (
        <div key={index}>
          <label>
            Opción {index + 1}:
            <input type="text" name="options" value={option} onChange={(e) => handleChange(e, index)} />
          </label>
        </div>
      ))}
      <div>
        <label>
          Respuesta correcta (0-3):
          <input type="text" name="correctOptionIndex" value={formData.correctOptionIndex} onChange={handleChange} />
        </label>
      </div>
      <button type="submit">Guardar</button>
      <button type="button" onClick={onCancel}>Cancelar</button>
    </form>
  );
};

export default UpdateQuestion;
