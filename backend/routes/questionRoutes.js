//questionroutes.js
import express from 'express';
import questionController from '../controllers/questionController.js';

var questionRouter = express.Router();

//definir rutas de la app
questionRouter.post('/savequestion', questionController.save);
questionRouter.get('/questions', questionController.getQuestions);

export default questionRouter;