//questioncontroller.js
import Question from "../models/questionModel.js";

const questionController = {
  //Función para guardar nueva pregunta
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

  //Función para actualizar una pregunta existente
  updateQuestion: async (req, res) => {
    try {
      const { questionId } = req.params;
      const updateParams = req.body;
      
      const updatedQuestion = await Question.findByIdAndUpdate(questionId, updateParams, { new: true });

      if (!updatedQuestion) {
        return res.status(404).send({
          status: 'Error',
          message: 'Pregunta no encontrada'
        });
      }

      res.status(200).send({
        status: 'Success',
        updatedQuestion
      });
    } catch (error) {
      console.error('Error al actualizar la pregunta:', error);
      res.status(500).send({
        status: 'Error',
        message: 'Error al actualizar la pregunta. Por favor, inténtalo de nuevo más tarde.'
      });
    }
  },

  //Función para eliminar una pregunta
  deleteQuestion: async (req, res) => {
    try {
      const { questionId } = req.params;
      await Question.findByIdAndDelete(questionId);
      res.status(200).send({
        status: 'Success',
        message: 'Pregunta eliminada correctamente'
      });
    } catch (error) {
      console.error('Error al eliminar la pregunta:', error);
      res.status(500).send({
        status: 'Error',
        message: 'Error al eliminar la pregunta. Por favor, inténtalo de nuevo más tarde.'
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
