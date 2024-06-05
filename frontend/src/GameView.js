import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

const GameView = ({ socket, gameData }) => {
  const [question, setQuestion] = useState(null);
  const [timer, setTimer] = useState(10); // Timer set to 10 seconds for each question
  const [score, setScore] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [hasAnswered, setHasAnswered] = useState(false); // Track if the user has answered the question
  const [showAnswer, setShowAnswer] = useState(false); // Track if the correct answer should be shown
  const navigate = useNavigate();
  const { gamePIN } = useParams();
  const location = useLocation();
  
  const questions = location.state?.gameData.questions || [];

  useEffect(() => {
    if (!questions.length) return;

    socket.emit("joinRoom", gamePIN);

    socket.on("nextQuestion", (questionData) => {
      setQuestion(questionData.question);
      setTimer(questionData.time || 10); // Default to 10 seconds if time is not provided
      setQuestionIndex(questionData.index);
      setHasAnswered(false); // Reset answered state for new question
      setShowAnswer(false); // Reset show answer state for new question
    });

    socket.on("gameEnded", () => {
      navigate(`/podium/${gamePIN}`);
    });

    return () => {
      socket.off("nextQuestion");
      socket.off("gameEnded");
    };
  }, [gamePIN, navigate, socket, questions]);

  useEffect(() => {
    if (timer > 0) {
      const timerId = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(timerId);
    } else {
      // Time's up, show correct answer and move to the next question after a delay
      setShowAnswer(true);
      setTimeout(() => {
        const nextIndex = questionIndex + 1;
        if (nextIndex < questions.length) {
          setQuestionIndex(nextIndex);
          setTimer(2); // Reset timer for next question
          setHasAnswered(false); // Reset answered state for new question
          setShowAnswer(false); // Reset show answer state for new question
        } else {
          // End game if no more questions
          socket.emit("endGame", gamePIN);
          navigate(`/podium`); // Navigate to podium view
        }
      }, 3000); // Show the answer for 3 seconds before moving to the next question
    }
  }, [timer, questionIndex, questions.length, gamePIN, socket, navigate]);

  const handleAnswer = (selectedOption) => {
    if (timer > 0 && !hasAnswered) { // Only handle answer if the user hasn't answered yet
      const isCorrect = selectedOption === questions[questionIndex].correctOptionIndex;
      if (isCorrect) {
        setScore(score + 10); // Add 10 points for correct answer
      }
      socket.emit("answerQuestion", {
        gamePIN: gamePIN,
        questionIndex,
        selectedOption,
        score: score + (isCorrect ? 10 : 0),
      });
      setHasAnswered(true); // Mark as answered
    }
  };

  if (!questions.length) {
    return <div>Loading...</div>;
  }

  const currentQuestion = questions[questionIndex];

  return (
    <div className="game-view">
      <h1>Juego</h1>
      <h3>{currentQuestion.title}</h3>
      <div>Tiempo restante: {timer} segundos</div>
      <ul>
        {currentQuestion.options.map((option, index) => (
          <button 
            key={index} 
            onClick={() => handleAnswer(index)} 
            style={{ pointerEvents: hasAnswered ? 'none' : 'auto', opacity: hasAnswered ? 0.5 : 1 }}
            className={showAnswer && index === currentQuestion.correctOptionIndex ? 'correct-answer' : ''}
          >
            {option}
          </button>
        ))}
      </ul>
      {showAnswer && (
        <div className="correct-answer-display">
          Respuesta correcta: {currentQuestion.options[currentQuestion.correctOptionIndex]}
          <div>Puntuación: {score}</div>

        </div>
      )}
    </div>
  );
};

export default GameView;
