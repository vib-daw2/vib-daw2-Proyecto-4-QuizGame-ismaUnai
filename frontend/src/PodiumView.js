import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./App.css";

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
    <div className="podium-container">
      <div className="podium-content">
        <h1 className="podium-title">Podio</h1>
        <ul className="podium-list">
          {players.map((player, index) => (
            <li key={index}>{player.name}: {player.score} puntos</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default PodiumView;
