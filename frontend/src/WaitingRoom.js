import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const WaitingRoom = ({ socket }) => {
  const { gamePIN } = useParams();
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [gameData, setGameData] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    socket.emit('joinRoom', gamePIN);

    socket.on('playersUpdated', (updatedPlayers) => {
      setPlayers(updatedPlayers);
    });

    socket.on('gameStarted', (data) => {
      console.log('Game started with data:', data);
      setGameData(data); // Guardar los datos de la partida
      setGameStarted(true); // Marcar que la partida ha comenzado
    });

    return () => {
      socket.off('playersUpdated');
      socket.off('gameStarted');
    };
  }, [gamePIN, socket]);

  useEffect(() => {
    if (gameStarted && gameData) {
      navigate(`/game`, { state: { gameData } }); // Redirigir al jugador a la vista del juego
    }
  }, [gameStarted, gameData, gamePIN, navigate]);

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
}

export default WaitingRoom;
