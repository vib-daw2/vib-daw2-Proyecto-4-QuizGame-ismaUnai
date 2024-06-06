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
      alert('PIN copiado al portapapeles');
    }).catch((err) => {
      console.error('Error al copiar el PIN: ', err);
    });
  };

  const handleStartGame = () => {
    console.log("gameData:", gameData);
    console.log('Jugadores:', players);

    socket.emit('startGame', gameData.PIN);
    navigate(`/game`, { state: { gameData } }); // Pass gameData to GameView
  };

  const printGameDetails = () => {
    console.log('Detalles de la partida:');
    console.log('PIN:', gameData.PIN);
    console.log('Jugadores:', players);
    console.log('Preguntas:', gameData.questions);
  };

  return (
    <div className="lobby-container">
      <div className="lobby-content">
        <h1 className="lobby-title">LOBBY - {gameData.PIN}</h1>
        <div className="lobby-details">
          <button className="copy-button" onClick={copyToClipboard}><FaCopy /></button>
          <button className="game-details-button" onClick={printGameDetails}>Imprimir Detalles</button>
        </div>
        <h2>Jugadores:</h2>
        <ul className="players-list">
          {players.length > 0 ? (
            players.map((player, index) => (
              <li key={index}>{player}</li>
            ))
          ) : (
            <li>No hay jugadores en el lobby</li>
          )}
        </ul>
        <h2>Preguntas:</h2>
        <ul className="questions-list">
          {gameData.questions && gameData.questions.length > 0 ? (
            gameData.questions.map((question, index) => (
              <li key={index}>{question.title}</li>
            ))
          ) : (
            <li>No hay preguntas disponibles</li>
          )}
        </ul>
        <button className="start-button" onClick={handleStartGame}>Iniciar Partida</button>
      </div>
    </div>
  );
}

export default Lobby;
