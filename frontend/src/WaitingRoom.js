import React from 'react';

function WaitingRoom({ gameName, pin, players }) {
  return (
    <div className="waiting-room">
      <h2>Detalles de la partida</h2>
      <p>Nombre de la partida: {gameName}</p>
      <p>PIN: {pin}</p>
      
      <h3>Jugadores conectados:</h3>
      <ul>
        {players && players.map((player, index) => (
          <li key={index}>{player}</li>
        ))}
      </ul>

      <p>Esperando a que el administrador inicie la partida...</p>
    </div>
  );
}

export default WaitingRoom;
