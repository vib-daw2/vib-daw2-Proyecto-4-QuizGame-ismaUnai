//EditQuestions.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UpdateQuestion from './CRUD/UpdateQuestion.js'; // Asegúrate de importar UpdateQuestion correctamente
import DeleteQuestion from './CRUD/DeleteQuestion.js'; // Asegúrate de importar DeleteQuestion correctamente
import { useNavigate } from 'react-router-dom'; // Importa useNavigate

function EditQuestions({ onBack }) {
  const [questions, setQuestions] = useState([]);
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    options: ['', '', '', ''],
    correctOptionIndex: ''
  });
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [showQuestionDetails, setShowQuestionDetails] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false); // Asegúrate de definir showUpdateForm
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false); // Definir showDeleteConfirmation
  const navigate = useNavigate(); // Usa useNavigate para redireccionar

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

  const handleQuestionClick = (question) => {
    setSelectedQuestion(question);
    setShowQuestionDetails(true);
    setShowUpdateForm(false); // Reset showUpdateForm when clicking a question
    setFormData({
      category: question.category,
      title: question.title,
      options: question.options.slice(),
      correctOptionIndex: question.correctOptionIndex
    });
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

  const handleUpdateQuestion = async (updatedQuestion) => {
    try {
      const response = await axios.put(`http://localhost:4000/api/questions/${selectedQuestion._id}`, updatedQuestion);
      console.log('Question updated:', response.data);
      setSelectedQuestion(null);
      setShowUpdateForm(false);
      setShowQuestionDetails(false); // Reset showQuestionDetails after update
      fetchQuestions();
    } catch (error) {
      console.error('Error updating question:', error);
    }
  };

  const handleDeleteQuestion = async () => {
    try {
      await axios.delete(`http://localhost:4000/api/questions/${selectedQuestion._id}`);
      setSelectedQuestion(null);
      setShowDeleteConfirmation(false);
      setShowQuestionDetails(false); // Reset showQuestionDetails after delete
      fetchQuestions();
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  };

  const handleBack = () => {
    navigate('/'); // Redirige al usuario a la página de inicio (/home)
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
            placeholder="Pregunta..."
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
              placeholder={`Opción ${index}`}
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
      {selectedQuestion && showQuestionDetails && (
        <div className="popup">
          <h2>Detalles de la pregunta</h2>
          <p>Categoría: {selectedQuestion.category}</p>
          <p>Título: {selectedQuestion.title}</p>
          <p>Opciones: {selectedQuestion.options.join(', ')}</p>
          <button onClick={() => setShowQuestionDetails(false)}>Cerrar</button>
          <button onClick={() => setShowUpdateForm(true)}>Editar</button>
          <button onClick={() => setShowDeleteConfirmation(true)}>Eliminar</button>
        </div>
      )}
      {selectedQuestion && showUpdateForm && (
        <UpdateQuestion
          question={selectedQuestion}
          onUpdate={handleUpdateQuestion}
          onCancel={() => setShowUpdateForm(false)}
        />
      )}
      {selectedQuestion && showDeleteConfirmation && (
        <DeleteQuestion
          questionId={selectedQuestion._id}
          onDelete={handleDeleteQuestion}
          onCancel={() => setShowDeleteConfirmation(false)}
        />
      )}
      <div>
        <h1>Editar Preguntas</h1>
        <ul>
          {questions.map((question) => (
            <li
              key={question._id}
              onClick={() => handleQuestionClick(question)}
            >
              Category: {question.category}, Title: {question.title}
            </li>
          ))}
        </ul>
        <button onClick={handleBack}>Volver</button>
      </div>
    </div>
  );
}

export default EditQuestions;
