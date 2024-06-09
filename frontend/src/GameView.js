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
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [scoreWithPlayer, setScoreWithPlayer] = useState([]);
  const gameData = location.state?.gameData;
  const questions = gameData?.questions || [];
  const questionTime = gameData?.questionTime;
  useEffect(() => {
    if (!gameData || !gameData.PIN) {
      setError(true);
      return;
    }

    socket.emit("joinRoom", gameData.PIN);

    socket.on("gameStart", (gameStartData) => {
      setQuestionIndex(0);
      setQuestion(questions[0]);
      setTimer(gameStartData.questionTime);
    });

    socket.on("nextQuestion", (questionData) => {
      setQuestion(questionData.question);
      setTimer(questionData.time || questionTime);
      setQuestionIndex(questionData.index);
      setHasAnswered(false);
      setShowAnswer(false);
    });
    socket.on("gameEnded", () => {
      navigate(`/podium`, { state: { gameData, score } });
    });

    return () => {
      socket.off("nextQuestion");
      socket.off("gameEnded");
    };
  }, [gameData, questions, questionTime, socket, score, navigate]);

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
          setQuestion(questions[nextIndex]);
          setTimer(questionTime);
          setHasAnswered(false);
          setShowAnswer(false);
        } else {
          socket.emit("endGame", {
            pin: gameData.PIN,
            player: localStorage.getItem("player"),
            score,
          });
          navigate(`/podium`, { state: { gameData, scoreWithPlayer } });
        }
      }, 3000);
    }
  }, [
    timer,
    questionIndex,
    questions,
    questionTime,
    socket,
    score,
    gameData,
    scoreWithPlayer,
    navigate,
  ]);
  const handleAnswer = (selectedOption) => {
    if (timer > 0 && !hasAnswered) {
      const timeRemaining = timer;
      const currentQuestion = questions[questionIndex];
      if (currentQuestion) {
        const isCorrect = selectedOption === currentQuestion.correctOptionIndex;
        let points = 0;
        if (isCorrect) {
          points =
            timeRemaining < 1
              ? 500
              : Math.max(0, 500 - (10 - timeRemaining) * 47);
          setScore(score + points);
        updateOrAddPlayerScore(localStorage.getItem("player"), score + points);
        }

        socket.emit("answerQuestion", {
          gamePIN: gameData.PIN,
          questionIndex,
          selectedOption,
          score: score + (isCorrect ? points : 0),
        });
        setHasAnswered(true);
      }
    }
  };
  const updateOrAddPlayerScore = (player, newScore) => {
    setScoreWithPlayer((prev) => {
      const playerExists = prev.find((ele) => ele.player === player);

      if (playerExists) {
        return prev.map((ele) => {
          if (ele.player === player) {
            return { ...ele, score: newScore };
          }
          return ele;
        });
      } else {
        return [...prev, { player, score: newScore }];
      }
    });
  };

  if (error) {
    return (
      <div className="error-container">
        <h3 className="error-message">
          Los datos del juego no se han cargado. Porfavor intentalo de nuevo. 
        </h3>
      </div>
    );
  }

  if (!questions.length) {
    return <div>Cargando...</div>;
  }

  const currentQuestion = questions[questionIndex];

  return (
    <div className="game-container">
      <div className="game-content">
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
        {showAnswer && (
          <div className="correct-answer-display">
            Respuesta correcta:{" "}
            {currentQuestion.options[currentQuestion.correctOptionIndex]}
            <div>Puntuación: {score}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameView;
