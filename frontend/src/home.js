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
      setErrorMessage('Please complete all the fields.');
      return;
    }

    onJoinGame(playerName, gamePIN);
    navigate(`/waitingRoom`);
  };

  const handleCreateGame = () => {

    if (!playerName) {
      setErrorMessage('Please introduce a player name.');
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
        <h1>WELCOME Hoodgame</h1>
        <label>
          PLAYER NAME:
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
          />
        </label>
        <label>
          PIN GAME:
          <input
            type="text"
            value={gamePIN}
            onChange={(e) => setGamePIN(e.target.value)}
          />
        </label>
        <br></br>
        <button className="button" onClick={handleCreateGame}>Create a party</button>
        <button className="button" onClick={handleJoinGame}>Join a party</button>
        <button className="button" onClick={handleEditQuestions}>Questions adminsitrations</button>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
    </div>
  );
}

export default Home;
