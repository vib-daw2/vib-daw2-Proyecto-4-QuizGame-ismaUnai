import React, { useState } from 'react';
import './App.css'; // Importa tus estilos CSS

function Home({ onCreateGame, onJoinGame, onEditQuestions }) {
  const [playerName, setPlayerName] = useState('');
  const [gamePIN, setGamePIN] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleJoinGame = () => {
    if (!playerName || !gamePIN) {
      setErrorMessage('Por favor, completa todos los campos.');
      return;
    }

    onJoinGame(playerName, gamePIN);
  };

  return (
    <div className="container">
      <div className="content">
        <h1>Bienvenido a tu juego</h1>
        <label>
          Nombre de jugador:
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
          />
        </label>
        <label>
          PIN del juego:
          <input
            type="text"
            value={gamePIN}
            onChange={(e) => setGamePIN(e.target.value)}
          />
        </label>
        <br></br>
        <button className="button" onClick={onCreateGame}>Crear Partida</button>
        <button className="button" onClick={() => handleJoinGame()}>Unirse a la partida</button>
        <button className="button" onClick={onEditQuestions}>Administrar preguntas</button>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
    </div>
  );
}

export default Home;
