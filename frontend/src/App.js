import './App.css';
import { io } from 'socket.io-client';
import React, { useState, useEffect } from 'react';
import Home from './home';
import CreateGame from './CreateGame';
import EditQuestions from './EditQuestions';
import ReadQuestion from './CRUD/ReadQuestion'; 
import Lobby from './Lobby';
import WaitingRoom from './WaitingRoom';

const socket = io('http://localhost:4000');

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [showCreateGame, setShowCreateGame] = useState(false);
  const [showLobby, setShowLobby] = useState(false);
  const [showWaitingRoom, setShowWaitingRoom] = useState(false);
  const [showEditQuestions, setShowEditQuestions] = useState(false); // Nuevo estado para mostrar EditQuestions
  const [gameData, setGameData] = useState({});

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
    setShowWaitingRoom(true);
  };

  const handleCreateGame = () => {
    setShowCreateGame(true);
  };

  const handleBackToHome = () => {
    setShowCreateGame(false);
    setShowLobby(false);
    setShowWaitingRoom(false);
    setShowEditQuestions(false); // Oculta EditQuestions al volver a Home
  };

  const handleShowLobby = () => {
    setShowLobby(true);
  };

  const handleEnterGame = (playerName, gamePIN) => {
    console.log("Entrando al juego:", { playerName, gamePIN });
  };

  const handleEditQuestions = () => {
    setShowEditQuestions(true); // Muestra EditQuestions al hacer clic en el botón
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
      ) : showWaitingRoom ? (
        <WaitingRoom
          gameName={gameData.gameName}
          pin={gameData.PIN}
          players={gameData.players}
        />
      ) : showEditQuestions ? (
        <EditQuestions onBack={handleBackToHome} /> // Muestra EditQuestions si showEditQuestions es true
      ) : (
        <Home
          onCreateGame={handleCreateGame}
          onJoinGame={handleJoinGame}
          onEditQuestions={handleEditQuestions}
          onEnterGame={handleEnterGame}
        />
      )}
    </div>
  );
}

export default App;
