import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import "./App.css";

const PodiumView = ({ socket }) => {
  const { gamePIN } = useParams();
  const { state } = useLocation();
  const { gameDate } = state;
  const [podiumData, setPodiumData] = useState([]);
  console.log(podiumData);

  useEffect(() => {
    socket.emit("getPodium", gameDate?.PIN);

    const handlePodiumData = (podiumData) => {
      podiumData?.scorePlayer?.sort((a, b) => b?.score - a?.score);
      setPodiumData(podiumData?.scorePlayer);
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
        <h1 className="podium-title">Podium</h1>
        <ul className="podium-list">
          {podiumData?.map(
            (player, index) =>
              index < 3 && (
                <li key={index}>
                  {player?.player}: {player?.score} puntos
                </li>
              )
          )}
        </ul>
      </div>
    </div>
  );
};

export default PodiumView;
