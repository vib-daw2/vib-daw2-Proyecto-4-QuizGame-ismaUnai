import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const PodiumView = ({ socket, gameData }) => {
  const { gamePIN } = useParams();
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    socket.emit('getPodium', gamePIN);

    socket.on('podiumData', (podiumData) => {
      setPlayers(podiumData);
    });

    return () => {
      socket.off('podiumData');
    };
  }, [gamePIN, socket]);

  return (
    <div className="podium-view">
      <h1>Podio</h1>
      <button>
        {players.map((player, index) => (
          <li key={index}>{player.name}: {player.score} puntos</li>
        ))}
      </button>
    </div>
  );
};

export default PodiumView;
