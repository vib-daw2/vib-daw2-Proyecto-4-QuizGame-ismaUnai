//questioncontroller.js
import Question from "../models/questionModel.js";

const questionController = {
  //Función para guardar nueva pregunta
  //http://localhost:4000/api/save
  save: async (req, res) => {
    try {
      const params = req.body;
      const question = new Question({
        category: params.category,
        title: params.title,
        options: params.options,
        correctOptionIndex: params.correctOptionIndex
      });
      const questionStored = await question.save();
      
      res.status(200).send({
        status: 'Success',
        questionStored
      });
    } catch (error) {
      console.error('Error al guardar la pregunta:', error);
      res.status(500).send({
        status: 'error',
        question: 'No ha sido posible guardar la pregunta'
      });
    }
  },

  //Función para obtener todas las preguntas
  getQuestions: async (req, res) => {
    try {
      const questions = await Question.find({}).sort('category');
      
      /*if (questions.length === 0) {
        return res.status(404).send({
          status: 'Error',
          question: 'No hay preguntas que mostrar'
        });
      }*/
      
      res.status(200).send({
        status: 'Success',
        questions
      });
    } catch (error) {
      console.error('Error al obtener las preguntas:', error);
      res.status(500).send({
        status: 'Error',
        question: 'Error al extraer los datos de las preguntas'
      });
    }
  },
  //Función para obtener preguntas aleatorias de las categorías especificadas
  getRandomQuestions: async (categories, numberOfQuestions) => {
    try {
      const selectedQuestions = await Question.aggregate([
        { $match: { category: { $in: categories } } },
        { $sample: { size: numberOfQuestions } }
      ]);
      return selectedQuestions;
    } catch (error) {
      console.error('Error al obtener preguntas aleatorias:', error);
      throw new Error('Error al obtener preguntas aleatorias');
    }
  }
};

export default questionController;
