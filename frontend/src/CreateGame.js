import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./App.css";

function CreateGame({ socket }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [gameName, setGameName] = useState("");
  const [questionTime, setQuestionTime] = useState(5);
  const [numberOfQuestions, setNumberOfQuestions] = useState(5);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const handleCategoryChange = (category) => {
    const updatedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];
    setSelectedCategories(updatedCategories);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!gameName) {
      setErrorMessage("Please introduce a party name.");
      return;
    }

    const gameData = {
      gameName,
      questionTime,
      numberOfQuestions,
      selectedCategories,
    };
    socket.emit("createGame", { ...gameData, ...location.state });
    navigate("/lobby", { state: { gameData } });
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className="create-game-container">
      <div className="content2">
        <h1>Party configuration</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Party name:
            <input
              type="text"
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
            />
          </label>
          <label>
            Time for questions (seconds):
            <select
              value={questionTime}
              onChange={(e) => setQuestionTime(parseInt(e.target.value))}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
            </select>
          </label>
          <label>
            Quantity of questions:
            <select
              value={numberOfQuestions}
              onChange={(e) => setNumberOfQuestions(parseInt(e.target.value))}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
              <option value={40}>40</option>
            </select>
          </label>
          <label>
            <p className="Category">Category :</p>
            <div>
              <span>Sports</span>
              <input
                type="checkbox"
                checked={selectedCategories.includes("Deportes")}
                onChange={() => handleCategoryChange("Deportes")}
              />
            </div>
            <div>
              <span>Music</span>
              <input
                type="checkbox"
                checked={selectedCategories.includes("Música")}
                onChange={() => handleCategoryChange("Música")}
              />
            </div>
            <div>
              <span>Geografy</span>
              <input
                type="checkbox"
                checked={selectedCategories.includes("Geografía")}
                onChange={() => handleCategoryChange("Geografía")}
              />
            </div>
            <div>
              <span>entertainment</span>
              <input
                type="checkbox"
                checked={selectedCategories.includes("Entretenimiento")}
                onChange={() => handleCategoryChange("Entretenimiento")}
              />
            </div>
          </label>
          <button type="submit">Save Configuration</button>
        </form>
        <button onClick={handleBack}>GO home</button>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
    </div>
  );
}

export default CreateGame;
