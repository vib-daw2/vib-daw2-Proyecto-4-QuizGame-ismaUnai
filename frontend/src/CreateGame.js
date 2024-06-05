import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

import "./App.css"; 

function CreateGame({ socket, onBack }) {
  const navigate = useNavigate();
  const [gameName, setGameName] = useState("");
  const [questionTime, setQuestionTime] = useState(5);
  const [numberOfQuestions, setNumberOfQuestions] = useState(5);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleCategoryChange = (category) => {
    const updatedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];
    setSelectedCategories(updatedCategories);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const gameData = {
      gameName,
      questionTime,
      numberOfQuestions,
      selectedCategories,
    };
    // Emitir el evento createGame con los datos de la partida al servidor
    socket.emit("createGame", gameData);
    navigate('/lobby', { state: { gameData } }); // Pasa los datos de la partida al navegar a Lobby

    const button = document.querySelector('.create-game-container button');

button.addEventListener('mouseenter', () => {
  button.style.animation = 'shake 0.4s ease-in-out infinite';
});

button.addEventListener('mouseleave', () => {
  button.style.animation = 'none';
});


  };

  return (
    <div className="create-game-container">
      <h1>Configurar Partida</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Nombre de la Partida:
          <input
            type="text"
            value={gameName}
            onChange={(e) => setGameName(e.target.value)}
          />
        </label>
        <label>
          Tiempo por Pregunta (segundos):
          <select
            value={questionTime}
            onChange={(e) => setQuestionTime(parseInt(e.target.value))}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
          </select>
        </label>
        <label>
          Cantidad de Preguntas:
          <select
            value={numberOfQuestions}
            onChange={(e) => setNumberOfQuestions(parseInt(e.target.value))}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
            <option value={30}>30</option>
            <option value={40}>40</option>
          </select>
        </label>
        <label>
           <p className="Category">Categorías :</p>
          <div>
            <span>Deportes</span>
            <input
              type="checkbox"
              checked={selectedCategories.includes("Deportes")}
              onChange={() => handleCategoryChange("Deportes")}
            />
          </div>
          <div>
            <span>Música</span>
            <input
              type="checkbox"
              checked={selectedCategories.includes("Música")}
              onChange={() => handleCategoryChange("Música")}
            />
          </div>
          <div>
            <span>Geografía</span>
            <input
              type="checkbox"
              checked={selectedCategories.includes("Geografía")}
              onChange={() => handleCategoryChange("Geografía")}
            />
          </div>
          <div>
            <span>Entretenimiento</span>
            <input
              type="checkbox"
              checked={selectedCategories.includes("Entretenimiento")}
              onChange={() => handleCategoryChange("Entretenimiento")}
            />
          </div>
        </label>
        
        <button type="submit">Guardar Configuración</button>
      </form>
      <button onClick={onBack}>Volver a Inicio</button>
    </div>
  );
}


export default CreateGame;