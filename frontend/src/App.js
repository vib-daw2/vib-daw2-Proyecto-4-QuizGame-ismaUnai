import "./App.css";
import { io } from "socket.io-client";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./home";
import CreateGame from "./CreateGame";
import EditQuestions from "./EditQuestions";
import Lobby from "./Lobby";
import WaitingRoom from "./WaitingRoom";
import GameView from "./GameView";
import PodiumView from "./PodiumView";

const socket = io("http://localhost:4000");

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [gameState, setGameState] = useState({
    view: "home",
    gameData: {}
  });

  useEffect(() => {
    socket.on("connect", () => setIsConnected(true));
    socket.on("disconnect", () => setIsConnected(false));

    socket.on("gameCreated", (newGame) => {
      setGameState({
        view: "lobby",
        gameData: newGame
      });
    });

    socket.on("gameStarted", () => {
      setGameState((prevState) => ({
        ...prevState,
        view: "game"
      }));
    });

    socket.on("gameEnded", () => {
      setGameState((prevState) => ({
        ...prevState,
        view: "podium"
      }));
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("gameCreated");
      socket.off("gameStarted");
      socket.off("gameEnded");
    };
  }, []);

  const handleJoinGame = (playerName, gamePIN) => {
    socket.emit("joinGame", { playerName, gamePIN });
    setGameState({
      view: "waitingRoom",
      gameData: { PIN: gamePIN }
    });
  };

  const handleCreateGame = () => {
    setGameState({
      view: "createGame",
      gameData: {}
    });
  };

  const handleBackToHome = () => {
    setGameState({
      view: "home",
      gameData: {}
    });
  };

  const handleEditQuestions = () => {
    setGameState({
      view: "editQuestions",
      gameData: {}
    });
  };

  return (
    <Router>
      <div className="App">
        <h2>{isConnected ? "Conectado" : "No Conectado"}</h2>
        <Routes>
          <Route path="/" element={<Home onCreateGame={handleCreateGame} onJoinGame={handleJoinGame} onEditQuestions={handleEditQuestions} />} />
          <Route path="/create-game" element={<CreateGame socket={socket} onBack={handleBackToHome} />} />
          <Route path="/edit-questions" element={<EditQuestions onBack={handleBackToHome} />} />
          <Route path="/lobby" element={<Lobby socket={socket} gameData={gameState.gameData} />} />
          <Route path="/waitingRoom" element={<WaitingRoom socket={socket} gameData={gameState.gameData} />} />
          <Route path="/game" element={<GameView socket={socket} gameData={gameState.gameData} />} />
          <Route path="/podium" element={<PodiumView socket={socket} gameData={gameState.gameData} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
