// Importamos el módulo que es una biblioteca de creación de objetos de MongoDB
const mongoose = require('mongoose');

// Definimos un esquema con la estructura de los documentos que se almacenan en la BBDD
const questionSchema = new mongoose.Schema({
    // Definimos cada campo con su tipo y propiedades
    category: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        required: true
    },
    question: {
        type: String,
        required: true
    },
    correct_answer: {
        type: String,
        required: true
    },
    incorrect_answers: {
        type: [String],
        required: true
    },
});

// Se crea y se exporta el modelo que se utilizará para interctuar con la colección de preguntas en la BBDD
module.exports = mongoose.model('Question', questionSchema);