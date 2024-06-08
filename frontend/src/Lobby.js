import React, { useState, useEffect } from 'react';
import { FaCopy } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import "./App.css";

function Lobby({ socket, gameData }) {
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    socket.on('playersUpdated', (updatedPlayers) => {
      setPlayers(updatedPlayers);
    });

    socket.on('gameStarted', () => {
      navigate(`/game`, { state: { gameData } }); // Pass gameData to GameView
    });

    return () => {
      socket.off('playersUpdated');
      socket.off('gameStarted');
    };
  }, [socket, navigate, gameData]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(gameData.PIN).then(() => {
      alert('PIN copy successfully');
    }).catch((err) => {
      console.error('Error to copy PIN: ', err);
    });
  };

  const handleStartGame = () => {
    console.log("gameData:", gameData);
    console.log('Players:', players);

    socket.emit('startGame', gameData.PIN);
    navigate(`/game`, { state: { gameData } }); // Pass gameData to GameView
  };

  const printGameDetails = () => {
    console.log('Game details:');
    console.log('PIN:', gameData.PIN);
    console.log('Players::', players);
    console.log('Questions:', gameData.questions);
  };

  return (
    <div className="lobby-container">
      <div className="lobby-content">
        <h1 className="lobby-title">LOBBY - {gameData.PIN}</h1>
        <div className="lobby-details">
          <button className="copy-button" onClick={copyToClipboard}><FaCopy /></button>
          <button className="game-details-button" onClick={printGameDetails}>Copy details</button>
        </div>
        <h2>Players:</h2>
        <ul className="players-list">
          {players.length > 0 ? (
            players.map((player, index) => (
              <li key={index}>{player}</li>
            ))
          ) : (
            <li>There is no players in lobby</li>
          )}
        </ul>
        <h2>Preguntas:</h2>
        <ul className="questions-list">
          {gameData.questions && gameData.questions.length > 0 ? (
            gameData.questions.map((question, index) => (
              <li key={index}>{question.title}</li>
            ))
          ) : (
            <li>There is no questions avaible</li>
          )}
        </ul>
        <button className="start-button" onClick={handleStartGame}>Start game</button>
      </div>
    </div>
  );
}

export default Lobby;
