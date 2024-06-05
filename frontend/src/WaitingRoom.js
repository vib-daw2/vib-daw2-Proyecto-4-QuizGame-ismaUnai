import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const WaitingRoom = ({ socket, gameData }) => {
  const { gamePIN } = useParams();
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    socket.emit('joinRoom', gamePIN);

    socket.on('playersUpdated', (updatedPlayers) => {
      setPlayers(updatedPlayers);
    });

    socket.on('gameStarted', () => {
      navigate(`/game`);
    });

    return () => {
      socket.off('playersUpdated');
      socket.off('gameStarted');
    };
  }, [gamePIN, navigate, socket]);

  const startGame = () => {
    socket.emit('startGame', gamePIN);
  };

  return (
    <div className="waiting-room">
      <h3>Esperando a que el administrador inicie la partida...</h3>
      <ul>
        {players.map((player, index) => (
          <li key={index}>{player.name}</li>
        ))}
      </ul>
      {gameData.isAdmin && <button onClick={startGame}>Iniciar Juego</button>}
    </div>
  );
};

export default WaitingRoom;
