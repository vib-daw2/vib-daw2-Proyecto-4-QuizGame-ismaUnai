import React, { useState, useEffect } from 'react';
import { FaCopy } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

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
    const tempTextArea = document.createElement('textarea');
    tempTextArea.value = gameData.PIN;
    document.body.appendChild(tempTextArea);
    tempTextArea.select();
    document.execCommand('copy');
    document.body.removeChild(tempTextArea);
  };

  const handleStartGame = () => {
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
    <div>
      <h1>LOBBY - {gameData.PIN}</h1>
      <button className="copy-button" onClick={copyToClipboard}><FaCopy /></button>
      <button onClick={printGameDetails}>Imprimir Detalles</button>
      <h2>Jugadores:</h2>
      <ul>
        {players && players.length > 0 ? (
          players.map((players, index) => (
            <li key={index}>{players}</li>
          ))
        ) : (
          <li>No hay jugadores en el lobby</li>
        )}
      </ul>
      <h2>Preguntas:</h2>
      <ul>
        {gameData.questions && gameData.questions.length > 0 ? (
          gameData.questions.map((question, index) => (
            <li key={index}>{question.title}</li>
          ))
        ) : (
          <li>No hay preguntas disponibles</li>
        )}
      </ul>
      <button onClick={handleStartGame}>Iniciar Partida</button>
    </div>
  );
}

export default Lobby;
