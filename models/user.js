// Importamos el módulo que es una biblioteca de creación de objetos de MongoDB
const mongoose = require('mongoose');

// Definimos un esquema con la estructura de los documentos que se almacenan en la BBDD
const userSchema = new mongoose.Schema({
    // Definimos cada campo con su tipo y propiedades
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 4,
        maxlength: 20
    },
    password: {
        type: String,
        required: true
    }
});

// Se crea y se exporta el modelo que se utilizará para interctuar con la colección de preguntas en la BBDD
module.exports = mongoose.model('User', userSchema);