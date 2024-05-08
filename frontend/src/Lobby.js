//lobby.js
import React from 'react';
import { FaCopy } from 'react-icons/fa'; // Importa el ícono de copiar desde react-icons/fa

function Lobby({ players, pin, questions }) {

    //COPIAR PIN AL PORTAPAPELES
    const copyToClipboard = () => {
        const tempTextArea = document.createElement('textarea');
        tempTextArea.value = pin;
        document.body.appendChild(tempTextArea);
        tempTextArea.select();
        document.execCommand('copy');
        document.body.removeChild(tempTextArea);
    };

    const printGameDetails = () => {
      console.log('Detalles de la partida:');
      console.log('PIN:', pin);
      console.log('Jugadores:', players);
      console.log('Preguntas:', questions);
  };

  return (
    <div>
      <h1>LOBBY - {pin}</h1>
      <button className="copy-button" onClick={copyToClipboard}><FaCopy /></button>
      <button onClick={printGameDetails}>Imprimir Detalles</button> {/* Botón para imprimir los detalles de la partida */}
      <h2>Jugadores:</h2>
      <ul>
        {players && players.length > 0 ? (
          players.map((player, index) => (
            <li key={index}>{player}</li>
          ))
        ) : (
          <li>No hay jugadores en el lobby</li>
        )}
      </ul>
      <h2>Preguntas:</h2>
      <ul>
        {questions && questions.length > 0 ? (
          questions.map((question, index) => (
            <li key={index}>{question.title}</li>
          ))
        ) : (
          <li>No hay preguntas disponibles</li>
        )}
      </ul>
    </div>
  );      
}

export default Lobby;