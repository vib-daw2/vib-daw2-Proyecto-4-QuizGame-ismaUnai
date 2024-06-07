import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./App.css";

const PodiumView = ({ socket }) => {
  const { gamePIN } = useParams();
  const [podiumData, setPodiumData] = useState([]);

  useEffect(() => {
    socket.emit("getPodium", gamePIN);

    const handlePodiumData = (podiumData) => {
      setPodiumData(podiumData);
      console.log("Podium Data Received:", podiumData); // Imprimir los datos recibidos
    };
    console.log("Podium Data Received:", podiumData); // Imprimir los datos recibidos

    socket.on("podiumData", handlePodiumData);

    return () => {
      socket.off("podiumData", handlePodiumData);
    };
  }, [gamePIN, socket]);

  return (
    <div className="podium-container">
      <div className="podium-content">
        <h1 className="podium-title">Podio</h1>
        <ul className="podium-list">
          {podiumData.map((player, index) => (
            <li key={index}>
              {player.name}: {player.score} puntos
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PodiumView;
