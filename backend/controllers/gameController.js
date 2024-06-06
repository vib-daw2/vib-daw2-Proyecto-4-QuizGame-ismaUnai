const io = require('socket.io')(server); // Asegúrate de tener el servidor socket.io configurado correctamente

const games = {};

const generateQuestions = (numberOfQuestions, selectedCategories) => {
  // Aquí deberías implementar la lógica para generar o recuperar las preguntas basadas en las categorías seleccionadas
  // Esto es solo un ejemplo de preguntas generadas estáticamente
  const questions = [];
  for (let i = 0; i < numberOfQuestions; i++) {
    questions.push({
      title: `Pregunta ${i + 1}`,
      options: ["Opción 1", "Opción 2", "Opción 3", "Opción 4"],
      correctOptionIndex: Math.floor(Math.random() * 4)
    });
  }
  return questions;
};

const gameController = {
  games: games,
  createGame: (req, res) => {
    try {
      const { gameName, questionTime, numberOfQuestions, selectedCategories, PIN } = req.body;

      if (!gameName || !questionTime || !numberOfQuestions || !selectedCategories || !PIN) {
        return res.status(400).json({
          status: 'error',
          message: 'Todos los campos son requeridos.'
        });
      }

      const questions = generateQuestions(numberOfQuestions, selectedCategories);

      const game = {
        gameName,
        questionTime,
        numberOfQuestions,
        selectedCategories,
        questions, // Añadimos las preguntas aquí
        players: []
      };

      games[PIN] = game;

      res.status(200).json({
        status: 'success',
        game
      });
    } catch (error) {
      console.error('Error al crear la partida:', error);
      res.status(500).json({
        status: 'error',
        message: 'No ha sido posible crear la partida.'
      });
    }
  },

  joinGame: (req, res) => {
    try {
      const { playerName, PIN } = req.body;

      if (!games[PIN]) {
        return res.status(404).json({
          status: 'error',
          message: 'El juego no existe.'
        });
      }

      const currentPlayers = games[PIN].players;
      currentPlayers.push(playerName);

      res.status(200).json({
        status: 'success',
        players: currentPlayers
      });

      io.in(PIN).emit('playersUpdated', currentPlayers);
    } catch (error) {
      console.error('Error al unirse al juego:', error);
      res.status(500).json({
        status: 'error',
        message: 'No ha sido posible unirse al juego.'
      });
    }
  },

  startGame: (req, res) => {
    try {
      const { PIN } = req.body;

      if (!games[PIN]) {
        return res.status(404).json({
          status: 'error',
          message: 'El juego no existe.'
        });
      }

      const game = games[PIN];

      io.in(PIN).emit('gameStarted', {
        questions: game.questions,
        questionTime: game.questionTime
      });

      res.status(200).json({
        status: 'success',
        message: 'El juego ha comenzado.'
      });
    } catch (error) {
      console.error('Error al iniciar el juego:', error);
      res.status(500).json({
        status: 'error',
        message: 'No ha sido posible iniciar el juego.'
      });
    }
  }
};

export default gameController;
