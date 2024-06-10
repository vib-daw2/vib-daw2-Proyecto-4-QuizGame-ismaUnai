import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./App.css";

const PodiumView = ({ socket }) => {
  const { gamePIN } = useParams();
  const [podiumData, setPodiumData] = useState([]);
  const Navigate = useNavigate();
  useEffect(() => {
    socket.emit("getPodium", gamePIN);

    const handlePodiumData = (podiumData) => {
      setPodiumData(podiumData);
    };
    console.log("Podium Data Received:", podiumData); // Imprimir los datos recibidos

    socket.on("podiumData", handlePodiumData);

    return () => {
      socket.off("podiumData", handlePodiumData);
    };
  }, [gamePIN, podiumData, socket]);

  return (
    <div className="podium-container">
      <div className="podium-content">
        <h1 className="podium-title">Podium</h1>
        <ul className="podium-list">
          {podiumData.map((player, index) => (
            <li key={index}>
              {player.playerName}: {player.score} puntos
            </li>
          ))}
        </ul>
        <button
          onClick={() => {
            Navigate("/");
          }}
          className="return-button"
        >
          Go Home
        </button>
      </div>
    </div>
  );
};

export default PodiumView;
