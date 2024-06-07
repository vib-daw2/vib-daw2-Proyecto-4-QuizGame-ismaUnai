import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./App.css"; 

function CreateGame({ socket }) {
  const navigate = useNavigate();
  const [gameName, setGameName] = useState("");
  const [questionTime, setQuestionTime] = useState(5);
  const [numberOfQuestions, setNumberOfQuestions] = useState(5);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const handleCategoryChange = (category) => {
    const updatedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];
    setSelectedCategories(updatedCategories);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!gameName) {
      setErrorMessage('Por favor, introduce un nombre de partida.');
      return;
    }

    const gameData = {
      gameName,
      questionTime,
      numberOfQuestions,
      selectedCategories,
    };
    socket.emit("createGame", gameData);
    navigate('/lobby', { state: { gameData } });
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="create-game-container">
      <div className="content2">
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
        <button onClick={handleBack}>Volver a Inicio</button>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
    </div>
  );
}

export default CreateGame;
