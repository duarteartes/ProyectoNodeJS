// Importamos el módulo axios para realizar peticiones a un servidor remoto
const axios = require('axios');
// Importamos el modelo question para interactuar con la colección en la BBDD de MongoDB
const Question = require('../models/Question');

// Definimos una función asíncrona que recibe el número de preguntas a obtener por parámetro
async function getPreguntasExternas(numeroPreguntas) {
    try {
        // Utilizamos axios para realizar una petición a la API externa solicitando un número específico de preguntas
        const response = await axios.get(`https://opentdb.com/api.php?amount=${numeroPreguntas}`);
        // Si la solicitud fue exitosa se extraen las preguntas y se devuelven, si no mostramos un error
        if (response.status === 200) {
            const preguntasExternas = response.data.results;
            return preguntasExternas;
        } else {
            throw new Error("Error al obtener preguntas del servicio externo");
        }
    } catch (error) {
        // Si falla el bloque try, capturamos el error y mostramos un mensaje
        console.error("Error al obtener preguntas del servicio externo:", error);
        throw error;
    }
}

// Definimos una función asíncrona que recibe un array de preguntas como parámetro
async function guardarPreguntasEnBD(preguntas) {
    try {
        // Utilizamos el método create para guardar las preguntas en la BBDD y se devuelven las preguntas guardadas
        const preguntasGuardadas = await Question.create(preguntas);
        return preguntasGuardadas;
    } catch (error) {
        // Si falla el bloque try, capturamos el error y mostramos un mensaje
        console.error("Error al guardar preguntas en la base de datos:", error);
        throw error;
    }
}

// Exportamos las dos funciones para que puedan ser utilizadas en otros archivos de la aplicación
module.exports = {
    getPreguntasExternas,
    guardarPreguntasEnBD
};