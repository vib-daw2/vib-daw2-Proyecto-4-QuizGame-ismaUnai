import { createContext, useContext, useState } from "react";

const PlayerNameContext = createContext();

const PlayerNameProvider = ({ children }) => {
  const [playerName, setPlayerName] = useState("");

  const handlePlayerNameChange = (name) => {
    setPlayerName(name);
  };

  return (
    <PlayerNameContext.Provider value={{ handlePlayerNameChange, playerName }}>
      {children}
    </PlayerNameContext.Provider>
  );
};

const usePlayerName = () => {
  const context = useContext(PlayerNameContext);

  if (context === undefined)
    throw new Error("playerNameContext was used outside of playerNameProvider");

  return context;
};

export { usePlayerName, PlayerNameProvider };
