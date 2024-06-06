import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./App.css";

const GameView = ({ socket }) => {
  const [question, setQuestion] = useState(null);
  const [timer, setTimer] = useState(10);
  const [score, setScore] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const gameData = location.state?.gameData || {};
  const questions = gameData.questions || [];
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    console.log('Joining room with PIN:', gameData.PIN);
    socket.emit("joinRoom", gameData.PIN);

    socket.on("playersUpdated", (updatedPlayers) => {
      console.log('Players updated:', updatedPlayers);
      setPlayers(updatedPlayers);
    });

    socket.on("nextQuestion", (questionData) => {
      console.log('Next question data:', questionData);
      setQuestion(questionData.question);
      setTimer(questionData.time || 10);
      setQuestionIndex(questionData.index);
      setHasAnswered(false);
      setShowAnswer(false);
    });

    socket.on("gameEnded", () => {
      navigate(`/podium`, { state: { gameData } });
    });

    return () => {
      socket.off("playersUpdated");
      socket.off("nextQuestion");
      socket.off("gameEnded");
    };
  }, [gameData.PIN, navigate, socket]);

  useEffect(() => {
    if (timer > 0) {
      const timerId = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(timerId);
    } else {
      setShowAnswer(true);
      setTimeout(() => {
        const nextIndex = questionIndex + 1;
        if (nextIndex < questions.length) {
          setQuestionIndex(nextIndex);
          setTimer(10);
          setHasAnswered(false);
          setShowAnswer(false);
        } else {
          socket.emit("endGame", gameData.PIN);
          navigate(`/podium`, { state: { gameData } });
        }
      }, 3000);
    }
  }, [timer, questionIndex, questions.length, gameData.PIN, socket, navigate]);

  const handleAnswer = (selectedOption) => {
    if (timer > 0 && !hasAnswered) {
      const isCorrect = selectedOption === questions[questionIndex].correctOptionIndex;
      if (isCorrect) {
        setScore(score + 100);
      }
      socket.emit("answerQuestion", {
        gamePIN: gameData.PIN,
        questionIndex,
        selectedOption,
        score: score + (isCorrect ? 100 : 0),
      });
      setHasAnswered(true);
    }
  };

  const printGameDetails = () => {
    console.log("Detalles de la partida:");
    console.log("PIN:", gameData.PIN);
    console.log("Jugadores:", players);
    console.log("Preguntas:", questions);
  };

  if (!questions.length) {
    return <div>Loading...</div>;
  }

  const currentQuestion = questions[questionIndex];

  return (
    <div className="game-container">
      <div className="game-content">
        <h1 className="game-title">Juego</h1>
        <button className="print-button" onClick={printGameDetails}>Imprimir Detalles</button>
        <h3 className="question-title">{currentQuestion.title}</h3>
        <div className="timer">Tiempo restante: {timer} segundos</div>
        <ul className="options-list">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              style={{
                pointerEvents: hasAnswered ? "none" : "auto",
                opacity: hasAnswered ? 0.5 : 1,
              }}
              className={`option-button ${
                showAnswer
                  ? index === currentQuestion.correctOptionIndex
                    ? "correct-answer"
                    : "incorrect-answer"
                  : ""
              }`}
            >
              {option}
            </button>
          ))}
        </ul>
        <h2 className="game-title">Jugadores:</h2>
        {showAnswer && (
          <div className="correct-answer-display">
            Respuesta correcta: {currentQuestion.options[currentQuestion.correctOptionIndex]}
            <div>Puntuación: {score}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameView;
