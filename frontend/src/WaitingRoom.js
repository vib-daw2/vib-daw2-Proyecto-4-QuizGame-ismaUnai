
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './App.css';

const WaitingRoom = ({ socket }) => {
  const { gamePIN } = useParams();
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [gameData, setGameData] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    socket.emit('joinRoom', gamePIN, (response) => {
      if (response.status !== 'success') {
        setError(true);
      }
    });

    socket.on('playersUpdated', (updatedPlayers) => {
      setPlayers(updatedPlayers);
    });

    socket.on('gameStarted', (data) => {
      console.log('Game started with data:', data);
      setGameData(data);
      setGameStarted(true);
    });

    return () => {
      socket.off('playersUpdated');
      socket.off('gameStarted');
    };
  }, [gamePIN, socket]);

  useEffect(() => {
    if (gameStarted && gameData) {
      navigate(`/game`, { state: { gameData } });
    }
  }, [gameStarted, gameData, gamePIN, navigate]);

  if (error) {
    return (
      <div className="error-container">
        <img src="../public/lobby.png" alt="Error" className="error-image" />
        <h3 className="error-message">No se pudo unir a la partida. Por favor, inténtalo de nuevo.</h3>
      </div>
    );
  }

  return (
    <div className="waiting-room-container">
      <div className="waiting-room-content">
        <h3 className="waiting-room-title">Esperando a que el administrador inicie la partida...</h3>
        <ul className="players-list">
          {players.map((player, index) => (
            <li key={index}>{player}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WaitingRoom;