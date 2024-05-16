import React, { useState } from 'react';
import axios from 'axios';

function DeleteQuestion({ questionId, onDelete, onCancel }) {
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await axios.delete(`http://localhost:4000/api/questions/${questionId}`);
      setIsDeleted(true);
      onDelete();
    } catch (error) {
      setError('Error al eliminar la pregunta. Por favor, inténtalo de nuevo más tarde.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="popup">
      <h2>Eliminar Pregunta</h2>
      <p>¿Estás seguro de que quieres eliminar esta pregunta?</p>
      {error && <p className="error-message">{error}</p>}
      {isDeleted ? (
        <p>¡La pregunta ha sido eliminada con éxito!</p>
      ) : (
        <>
          <button onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? 'Eliminando...' : 'Sí, Eliminar'}
          </button>
          <button onClick={onCancel} disabled={isDeleting}>Cancelar</button>
        </>
      )}
    </div>
  );
}

export default DeleteQuestion;
