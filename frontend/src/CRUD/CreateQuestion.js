//createquestion.js
import React, { useState } from 'react';
import axios from 'axios';

const CreateQuestion = ({ onCreate, onCancel }) => {
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    options: ['', '', '', ''],
    correctOptionIndex: ''
  });

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
      if (formData.title === '' || formData.options.some(option => option === '') || formData.correctOptionIndex === '') {
        console.log('Todos los campos son obligatorios');
        return;
      }

      const response = await axios.post('http://localhost:4000/api/savequestion', formData);
      console.log('Pregunta guardada:', response.data);
      onCreate(response.data.question);
      setFormData({
        category: '',
        title: '',
        options: ['', '', '', ''],
        correctOptionIndex: ''
      });
      onCancel();
    } catch (error) {
      console.error('Error guardando la pregunta:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-question-form">
      <div>
        <label>
          Categoría:
          <select name="category" value={formData.category} onChange={handleChange}>
            <option value="">Selecciona una categoría</option>
            <option value="Deportes">Deportes</option>
            <option value="Entretenimiento">Entretenimiento</option>
            <option value="Geografía">Geografía</option>
            <option value="Música">Música</option>
          </select>
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
          Respuesta correcta (índice):
          <select name="correctOptionIndex" value={formData.correctOptionIndex} onChange={handleChange}>
            <option value="">Selecciona una respuesta correcta</option>
            {[0, 1, 2, 3].map((index) => (
              <option key={index} value={index}>{index}</option>
            ))}
          </select>
        </label>
      </div>
      <button type="submit">Guardar</button>
      <button type="button" onClick={onCancel}>Cancelar</button>
    </form>
  );
}

export default CreateQuestion;
