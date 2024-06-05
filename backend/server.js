//server.js
import express from 'express';
import mongoose from 'mongoose';
import { Server as Socketserver } from 'socket.io';
import http from 'http';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import questionRouter from './routes/questionRoutes.js';
import questionController from './controllers/questionController.js';

let games = {}; // Objeto para almacenar los juegos

// Configuración de Mongoose y Express
const url = 'mongodb+srv://admin:admin@preguntas.shcqana.mongodb.net/?retryWrites=true&w=majority&appName=Preguntas';
mongoose.Promise = global.Promise;
const app = express();
const PORT = 4000;
const server = http.createServer(app);
const io = new Socketserver(server, {
    cors: {
        origin: "*"
    }
});

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

// SOCKET
io.on('connection', (socket) => {
    console.log(socket.id);
    console.log('Se ha conectado un cliente');

    // Manejo del evento createGame
    socket.on('createGame', async (gameData) => {
        console.log('Partida creada:', gameData);

        // Aquí puedes llamar a la función para obtener preguntas aleatorias
        const selectedQuestions = await questionController.getRandomQuestions(gameData.selectedCategories, gameData.numberOfQuestions);

        // Crear un objeto de juego con los datos de la partida
        const newGame = {
            gameName: gameData.gameName,
            questionTime: gameData.questionTime,
            numberOfQuestions: gameData.numberOfQuestions,
            selectedCategories: gameData.selectedCategories,
            PIN: generatePIN(), // Genera un PIN aleatorio para la partida
            players: [], // Inicializa la lista de jugadores vacía
            questions: selectedQuestions // Agrega las preguntas seleccionadas
        };
        console.log('PIN generado:', newGame.PIN);

        // Almacena el juego utilizando su PIN como clave en el objeto de juegos
        games[newGame.PIN] = newGame;

        // Emitir un evento de confirmación al cliente, incluyendo los jugadores y las preguntas
        socket.emit('gameCreated', newGame);

        // También puedes emitir un evento a todos los clientes para notificarles sobre la nueva partida
        io.emit('newGameCreated', newGame);
    });

    // Manejo del evento joinGame
    socket.on('joinGame', ({ playerName, gamePIN }) => {
        // Verificar si el juego existe
        if (!games[gamePIN]) {
            return socket.emit('joinGameError', { message: 'El juego no existe.' });
        }

        // Agregar al nuevo jugador a la lista de jugadores del juego
        games[gamePIN].players.push(playerName);

        // Emitir un evento 'playersUpdated' con la lista de jugadores actualizada
        io.emit('playersUpdated', games[gamePIN].players);
    });

    // Función para generar un PIN aleatorio de 6 dígitos
    function generatePIN() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let pin = '';
        for (let i = 0; i < 6; i++) {
            pin += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return pin;
    }

    socket.on('disconnect', () => {
        console.log('Cliente desconectado:', socket.id);
    });

});

// Rutas
app.use('/api', questionRouter);

// Conexión a la base de datos y escuchar la aplicación a través del puerto
mongoose.connect(url).then(() => {
    console.log('Conexión a la BD exitosa');
    server.listen(PORT, () => {
        console.log('Servidor corriendo en http://localhost:', PORT)
    })
});
