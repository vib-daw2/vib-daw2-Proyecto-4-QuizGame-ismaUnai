// DeleteQuestion.js
import React from 'react';
import axios from 'axios';

const DeleteQuestion = ({ questionId, onDelete, onCancel }) => {
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:4000/api/questions/${questionId}`);
      onDelete(questionId);
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  };

  return (
    <div className="popup">
      <h2>Eliminar Pregunta</h2>
      <p>¿Estás seguro de que deseas eliminar esta pregunta?</p>
      <button onClick={handleDelete}>Eliminar</button>
      <button onClick={onCancel}>Cancelar</button>
    </div>
  );
};

export default DeleteQuestion;
