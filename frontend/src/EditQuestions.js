// EditQuestions.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function EditQuestions({ onBack }) {
  const [questions, setQuestions] = useState([]);
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    options: ['', '', '', ''],
    correctOptionIndex: ''
  });

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/questions');
      setQuestions(response.data.questions);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    if (name === 'options') {
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
      const response = await axios.post('http://localhost:4000/api/savequestion', formData);
      console.log('Question saved:', response.data);
      setFormData({
        category: '',
        title: '',
        options: ['', '', '', ''],
        correctOptionIndex: ''
      });
      fetchQuestions();
    } catch (error) {
      console.error('Error saving question:', error);
    }
  };

  return (
    <div>
      <h1>Crear Pregunta</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Categoría:
          <select
            name="category"
            value={formData.category}
            onChange={(e) => handleChange(e)}
          >
            <option value="Deportes">Deportes</option>
            <option value="Música">Música</option>
            <option value="Geografía">Geografía</option>
            <option value="Entretenimiento">Entretenimiento</option>
          </select>
        </label>
        <label>
          Pregunta:
          <input
            type="text"
            name="title"
            placeholder='Pregunta...'
            value={formData.title}
            onChange={(e) => handleChange(e)}
          />
        </label>
        <label>
          Opciones:
          {formData.options.map((option, index) => (
            <input
              key={index}
              type="text"
              name="options"
              placeholder={`Opción ${index}`} // Concatenamos el índice al texto "Opción"
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
            value={formData.correctOptionIndex}
            onChange={(e) => handleChange(e)}
          />
        </label>
        <button type="submit">Save Question</button>
      </form>
      <h2>Questions List</h2>
      <ul>
        {questions.map((question) => (
          <li key={question._id}>
            Category: {question.category}, Title: {question.title}
          </li>
        ))}
      </ul>
      <button onClick={onBack}>Back to Home</button>
    </div>
  );
}

export default EditQuestions;
