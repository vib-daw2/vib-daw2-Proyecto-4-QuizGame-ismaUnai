// editquestions.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UpdateQuestion from './CRUD/UpdateQuestion';
import DeleteQuestion from './CRUD/DeleteQuestion';
import CreateQuestion from './CRUD/CreateQuestion';
import './App.css';

function EditQuestions({ onBack }) {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [currentCategory, setCurrentCategory] = useState('Deportes');

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

  const handleUpdateQuestion = async (updatedQuestion) => {
    try {
      await axios.put(`http://localhost:4000/api/questions/${updatedQuestion._id}`, updatedQuestion);
      await fetchQuestions();
      setShowUpdateForm(false);
      setSelectedQuestion(null);
    } catch (error) {
      console.error('Error updating question:', error);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    try {
      await axios.delete(`http://localhost:4000/api/questions/${questionId}`);
      setQuestions(questions.filter(q => q._id !== questionId));
      setShowDeleteConfirmation(false);
      setSelectedQuestion(null);
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  };

  const handleCreateQuestion = async (newQuestion) => {
    try {
      await axios.post('http://localhost:4000/api/savequestion', newQuestion);
      await fetchQuestions(); // Refrescar la lista de preguntas después de crear una nueva
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating question:', error);
    }
  };

  const handleQuestionClick = (question) => {
    setSelectedQuestion(question);
    setShowUpdateForm(true);
    setShowDeleteConfirmation(false);
  };

  const handleDeleteClick = (questionId) => {
    setSelectedQuestion(questions.find(q => q._id === questionId));
    setShowDeleteConfirmation(true);
    setShowUpdateForm(false);
  };

  const renderTable = (category) => (
    <table className="questions-table">
      <thead>
        <tr>
          <th>Categoría</th>
          <th>Título</th>
          <th>Opciones</th>
          <th>Respuesta Correcta</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {questions
          .filter(question => question && question.category === category)
          .map((question) => (
            question && (
              <React.Fragment key={question._id}>
                <tr>
                  <td>{question.category}</td>
                  <td>{question.title}</td>
                  <td>{question.options.join(', ')}</td>
                  <td>{question.options[question.correctOptionIndex]}</td>
                  <td>
                    <button onClick={() => handleQuestionClick(question)}>Editar</button>
                    <button onClick={() => handleDeleteClick(question._id)}>Eliminar</button>
                  </td>
                </tr>
                {showUpdateForm && selectedQuestion && selectedQuestion._id === question._id && (
                  <tr>
                    <td colSpan="5">
                      <UpdateQuestion
                        question={selectedQuestion}
                        onUpdate={handleUpdateQuestion}
                        onCancel={() => setShowUpdateForm(false)}
                      />
                    </td>
                  </tr>
                )}
                {showDeleteConfirmation && selectedQuestion && selectedQuestion._id === question._id && (
                  <tr>
                    <td colSpan="5">
                      <DeleteQuestion
                        questionId={selectedQuestion._id}
                        onDelete={handleDeleteQuestion}
                        onCancel={() => setShowDeleteConfirmation(false)}
                      />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            )
          ))}
      </tbody>
    </table>
  );

  return (
    <div>
      <h1>Editar Preguntas</h1>
      <button onClick={() => setShowCreateForm(true)}>Crear Pregunta</button>
      {showCreateForm && (
        <CreateQuestion
          onCreate={handleCreateQuestion}
          onCancel={() => setShowCreateForm(false)}
        />
      )}
      <div className="category-buttons">
        <button onClick={() => setCurrentCategory('Deportes')}>Deportes</button>
        <button onClick={() => setCurrentCategory('Entretenimiento')}>Entretenimiento</button>
        <button onClick={() => setCurrentCategory('Geografía')}>Geografía</button>
        <button onClick={() => setCurrentCategory('Música')}>Música</button>
      </div>
      <div className="category-table">
        {renderTable(currentCategory)}
      </div>
      <button onClick={onBack}>Volver</button>
    </div>
  );
}

export default EditQuestions;
