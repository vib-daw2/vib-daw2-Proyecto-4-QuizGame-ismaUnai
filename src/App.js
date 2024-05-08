import {useState} from "react";

import Navbar from "./components/Navbar.js"
import QuizScreen from "./components/QuizScreen.js"
import JoinScreen from "./components/JoinScreen.js"

function App() {
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  return (
    <>
      <Navbar/>
      <div classname="quiz-container">
        {
            isQuizStarted ? (
            <QuizScreen retry={() => setIsQuizStarted(false)} />
          ) : (
            <JoinScreen start={() => setIsQuizStarted(true)} />
          )
        }
      </div>
    </>
  );
}

export default App;
