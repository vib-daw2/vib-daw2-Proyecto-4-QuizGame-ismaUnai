import './App.css';
import { io } from 'socket.io-client';
import React, { useState, useEffect } from 'react';
import Home from './home';
import CreateGame from './CreateGame';
import EditQuestions from './EditQuestions';
import Lobby from './Lobby';

//conexion servidor
const socket = io('http://localhost:4000');

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [showCreateGame, setShowCreateGame] = useState(false);
  const [showLobby, setShowLobby] = useState(false);
  const [gameData, setGameData] = useState({}); // Estado para almacenar los datos de la partida

  useEffect(() => {
    socket.on('gameCreated', (newGame) => {
      setGameData(newGame);
      setShowCreateGame(false);
      setShowLobby(true);
    });

    socket.on('playersUpdated', (updatedPlayers) => {
      setGameData((prevGameData) => ({
        ...prevGameData,
        players: updatedPlayers
      }));
    });

    socket.on('connect', () => setIsConnected(true));

    return () => {
      socket.off('gameCreated');
      socket.off('playersUpdated');
    };
  }, []);

  const handleJoinGame = (playerName, gamePIN) => {
    socket.emit('joinGame', { playerName, gamePIN });
    console.log("Jugador se unió:", { playerName, gamePIN });
  };

  const handleCreateGame = () => {
    setShowCreateGame(true);
  };

  const handleBackToHome = () => {
    setShowCreateGame(false);
    setShowLobby(false);
  };

  const handleShowLobby = () => {
    setShowLobby(true);
  };

  return (
    <div className="App">
      <h2>{isConnected ? 'Conectado' : 'No Conectado'}</h2>
      {showCreateGame ? (
        <CreateGame socket={socket} onBack={handleBackToHome} />
      ) : showLobby ? (
        <Lobby
          pin={gameData.PIN}
          players={gameData.players}
          questions={gameData.questions}
        />
      ) : (
        <Home
          onCreateGame={handleCreateGame}
          onJoinGame={handleJoinGame}
        />
      )}
    </div>
  );
}

export default App;
