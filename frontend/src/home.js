import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css'; // Importa tus estilos CSS

function Home({ onCreateGame, onJoinGame, onEditQuestions }) {
  const [playerName, setPlayerName] = useState('');
  const [gamePIN, setGamePIN] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleJoinGame = () => {
    if (!playerName || !gamePIN) {
      setErrorMessage('Porfavor completa todos los campos');
      return;
    }

    onJoinGame(playerName, gamePIN);
    navigate(`/waitingRoom`);
  };

  const handleCreateGame = () => {

    if (!playerName) {
      setErrorMessage('Porfavor introduce un nombre al jugador');
      return;
    }
    
    onCreateGame();
    navigate('/create-game');
  };

  const handleEditQuestions = () => {
    onEditQuestions();
    navigate('/edit-questions');
  };

  return (
    <div className="container">
      <div className="content">
        <h1>BIENVENIDOS A HOODGAME</h1>
        <label>
          Nombre del jugador:
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
          />
        </label>
        <label>
          PIN de la partida:
          <input
            type="text"
            value={gamePIN}
            onChange={(e) => setGamePIN(e.target.value)}
          />
        </label>
        <br></br>
        <button className="button" onClick={handleCreateGame}>Crear una partida</button>
        <button className="button" onClick={handleJoinGame}>Unirse a la partida</button>
        <button className="button" onClick={handleEditQuestions}>Administracion de preguntas</button>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
    </div>
  );
}

export default Home;
