//gamecontroller.js
const games = {};

const gameController = {
  games: games,
  createGame: (req, res) => {
    try {
      const { gameName, questionTime, numberOfQuestions, selectedCategories, PIN } = req.body;

      // Validar que todos los campos requeridos estén presentes
      if (!gameName || !questionTime || !numberOfQuestions || !selectedCategories || !PIN) {
        return res.status(400).json({
          status: 'error',
          message: 'Todos los campos son requeridos.'
        });
      }

      // Crear un objeto de juego con la lista de jugadores inicialmente vacía
      const game = {
        gameName,
        questionTime,
        numberOfQuestions,
        selectedCategories,
        players: [] // Inicializa la lista de jugadores vacía
      };

      // Almacena el juego utilizando su PIN como clave en el objeto de estado del juego
      games[PIN] = game;
      
      // Enviar respuesta con el juego creado
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

      // Verificar si el juego existe
      if (!games[PIN]) {
        return res.status(404).json({
          status: 'error',
          message: 'El juego no existe.'
        });
      }

      // Obtener la lista de jugadores actual del juego
      const currentPlayers = games[PIN].players;

      // Agregar al nuevo jugador a la lista de jugadores
      currentPlayers.push(playerName);

      // Enviar respuesta con la lista de jugadores actualizada
      res.status(200).json({
        status: 'success',
        players: currentPlayers
      });

      // Emitir un evento a todos los clientes en esta partida para que actualicen la lista de jugadores
      io.in(PIN).emit('playersUpdated', currentPlayers);
    } catch (error) {
      console.error('Error al unirse al juego:', error);
      res.status(500).json({
        status: 'error',
        message: 'No ha sido posible unirse al juego.'
      });
    }
  }
};

export default gameController;