//questionmodel.js
import mongoose from "mongoose";
var Schema = mongoose.Schema;

var QuestionSchema = new Schema({
    category: String,
    title: String,
    options: [String],
    correctOptionIndex: Number
});

export default mongoose.model('question', QuestionSchema);