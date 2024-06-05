// Importamos los modelos y servicios necesarios para trabajar con las preguntas
const Question = require('../models/Question');
const { getPreguntasExternas, guardarPreguntasEnBD } = require('../services/questionService');

// Definimos una función para manejar la solicitud para obtener el listado de preguntas
// Es una función asíncrona que recibe los objetos de solicitud y respuesta como parámetros
exports.getAllQuestions = async (req, res) => {
    try {
        // Imprimimos un mensaje para indicar que se ha recibido una solicitud para obtener el listado de preguntas
        console.log('Recibida petición para obtener todas las preguntas');
        // Utilizamos la función find para obtener todas las preguntas en la BBDD
        // Utilizamos await para esperar a que se complete la búsqueda antes de continuar
        const questions = await Question.find({}, 'question');
        // Creamos un array que contiene los valores del campo question en cada objeto
        const questionTexts = questions.map(question => question.question);
        // Imprime por consola todas las preguntas encontradas en la BBDD
        console.log('Todas las preguntas:', questionTexts);
        console.log(' ');
        // Creamos un objeto con un mensaje introductorio y el array que representa las preguntas
        const responseObj = {
            message: 'Todas las preguntas:',
            questions: questionTexts
        };
        // Devuelve las preguntas encontradas como una respuesta JSON al cliente que hizo la solicitud
        res.json(responseObj);
    } catch (error) {
        // Si se produce un error dentro del bloque try lo imprimimos por consola para registrar el problema
        console.error(error);
        // Devolvemos una respuesta de error con el código 500 y un mensaje en JSON avisando que ha ocurrido un error
        res.status(500).json({ error: 'Error al obtener la lista de preguntas' });
    }
};

// Definimos una función para manejar las solicitudes de creación de una nueva pregunta
// Es una función asíncrona que recibe los objetos de solicitud y respuesta como parámetros
exports.createQuestion = async (req, res) => {
    try {
        // Extraemos todos los campos del body, esto asume que la solicitud contiene un cuerpo con estos campos
        const { category, type, difficulty, question, correct_answer, incorrect_answers } = req.body;
        // Creamos un nuevo objeto que representa a la nueva pregunta que se va a crear en la BBDD
        const newQuestion = new Question({
            category,
            type,
            difficulty,
            question,
            correct_answer,
            incorrect_answers
        });
        // Guardamos la nueva pregunta en la BBDD. Utilizamos el await para esperar a que el guardado se complete
        const savedQuestion = await newQuestion.save();
        // Mostramos un mensaje de éxito y los detalles de la pregunta en la consola
        console.log('Pregunta guardada correctamente en la base de datos');
        console.log('Detalles de la pregunta:', savedQuestion);
        console.log(' ');
        // Enviamos una respuesta JSON con un mensaje de éxito y los detalles de la pregunta que se acaba de introducir
        res.json({ message: 'Pregunta guardada correctamente en la base de datos', pregunta: savedQuestion });
    } catch (error) {
        // Si se produce un error dentro del bloque try lo imprimimos por consola para registrar el problema
        console.error(error);
        // Devolvemos una respuesta de error con el código 500 y un mensaje en JSON avisando que ha ocurrido un error
        res.status(500).json({ error: 'Error al crear la pregunta' });
    }
};

// Definimos una función para manejar las solicitudes de actualización de una nueva pregunta
// Es una función asíncrona que recibe los objetos de solicitud y respuesta como parámetros
exports.updateQuestion = async (req, res) => {
    try {
        // Extraemos el parámetro id de la solicitud para identificar la pregunta
        const { id } = req.params;
        // Extraemos los datos de actualización del cuerpo de la petición
        const updateData = req.body;
        // Actualizamos la pregunta en la BBDD. Utiliza el id y los datos de actualización
        // Asignamos el resultado a la variable question
        const question = await Question.findByIdAndUpdate(id, updateData, {
            // Indicamos que se debe devolver el documento actualizado
            new: true
        });
        // Mostramos un mensaje de éxito en la consola y la pregunta actualizada con sus detalles
        console.log('Pregunta actualizada correctamente en la base de datos');
        console.log('Detalles de la pregunta actualizada:', question);
        console.log(' ');
        // Enviamos una respuesta JSON con un mensaje de éxito y los detalles de la pregunta actualizada
        res.json({ message: 'Pregunta actualizada correctamente en la base de datos', pregunta: question });
    } catch (error) {
        // Si se produce un error dentro del bloque try lo imprimimos por consola para registrar el problema
        console.error(error);
        // Devolvemos una respuesta de error con el código 500 y un mensaje en JSON avisando que ha ocurrido un error
        res.status(500).json({ error: 'Error al actualizar la pregunta' });
    }
};

// Definimos una función para manejar las solicitudes de obtención de los detalles de una nueva pregunta por su id
// Es una función asíncrona que recibe los objetos de solicitud y respuesta como parámetros
exports.getQuestionById = async (req, res) => {
    try {
        // Extraemos el parámetro de id de la solicitud
        const { id } = req.params;
        // Buscamos la pregunta en la BBDD. Toma el id como argumento y devuelve el documento completo
        // Utilizamos el await para esperar a que se complete la búsqueda antes de continuar
        const question = await Question.findById(id);
        // Utilizamos un condicional para verificar si la pregunta existe en la BBDD
        if (!question) {
            // Si no existe se envía una respuesta con el error y detenemos la ejecución de la función
            return res.status(404).json({ error: 'Pregunta no encontrada' });
        }
        // Mostramos un mensaje de éxito con los detalles de la pregunta en la consola
        console.log('Detalles de la pregunta:', question);
        console.log(' ');
        // Enviamos una respuesta JSON con un mensaje de éxito y los detalles de la pregunta encontrada por su id
        res.json(question);
    } catch (error) {
        // Si se produce un error dentro del bloque try lo imprimimos por consola para registrar el problema
        console.error(error);
        // Devolvemos una respuesta de error con el código 500 y un mensaje en JSON avisando que ha ocurrido un error
        res.status(500).json({ error: 'Error al obtener los detalles de la pregunta' });
    }
};

// Definimos una función para manejar las solicitudes de eliminación de una pregunta existente
// Es una función asíncrona que recibe los objetos de solicitud y respuesta como parámetros
exports.deleteQuestion = async (req, res) => {
    try {
        // Extraemos el parámetro de id de la solicitud
        const { id } = req.params;
        // Eliminamos la pregunta de la BBDD tomando su id como argumento y eliminando el documento completo
        await Question.findByIdAndDelete(id);
        // Mostramos un mensaje de éxito de eliminación en la consola
        console.log('Pregunta eliminada correctamente');
        console.log(' ');
        // Enviamos una respuesta JSON con un mensaje de éxito
        res.json({ message: 'Pregunta eliminada correctamente' });
    } catch (error) {
        // Si se produce un error dentro del bloque try lo imprimimos por consola para registrar el problema
        console.error(error);
        // Devolvemos una respuesta de error con el código 500 y un mensaje en JSON avisando que ha ocurrido un error
        res.status(500).json({ error: 'Error al eliminar la pregunta' });
    }
};

// Definimos una función para manejar las solicitudes de obtención de preguntas de una API externa
// Es una función asíncrona que recibe los objetos de solicitud y respuesta como parámetros
exports.getExternalQuestions = async (req, res) => {
    try {
        // Extraemos el parámetro amount para especificar el número de preguntas que queremos obtener
        const { amount } = req.query;
        // Utilizamos una condición para verificar si la solicitud incluye un encabezado de autentificación
        if (req.headers.authorization) {
            // Si el usuario está autenticado y autorizado vamos con la ejecución que tenemos a continuación
            // Llamamos a una función del servicio que se encarga de se encarga de hacer una solicitud a la API externa
            const preguntasExternas = await getPreguntasExternas(amount);
            // Llamamos a una función del servicio que procesa y almacena las preguntas en la BBDD local
            const preguntasGuardadas = await guardarPreguntasEnBD(preguntasExternas);
            // Mostramos un mensaje de éxito en la consola
            console.log('Se han guardado las preguntas en la base de datos');
            console.log(' ');
            // Enviamos una respuesta JSON con un mensaje de éxito y las preguntas guardadas
            res.json({ message: 'Preguntas guardadas correctamente en la base de datos', preguntas: preguntasGuardadas });
        } else {
            // Si el usuario no está autenticado entonces iremos con la ejecución que tenemos justo a continuación
            // Llamamos a una función del servicio que se encarga de se encarga de hacer una solicitud a la API externa
            const preguntasExternas = await getPreguntasExternas(amount);
            // Mostramos un mensaje de éxito en la consola y avisamos de que no se van a guardar en la BBDD
            console.log('Estas preguntas no se guardarán en la BBDD porque no hay autentificación');
            console.log(' ');
            // Enviamos una respuesta JSON con un mensaje de éxito y las preguntas guardadas
            res.json({ message: 'Preguntas obtenidas correctamente', preguntas: preguntasExternas });
        }
    } catch (error) {
        // Si se produce un error dentro del bloque try lo imprimimos por consola para registrar el problema
        console.error(error);
        // Devolvemos una respuesta de error con el código 500 y un mensaje en JSON avisando que ha ocurrido un error
        res.status(500).json({ error: 'Error al obtener o guardar las preguntas' });
    }
};

// Definimos una función para manejar las solicitudes de búsqueda avanzada de preguntas
// Es una función asíncrona que recibe los objetos de solicitud y respuesta como parámetros
exports.advancedSearch = async (req, res) => {
    try {
        // Extraemos los parámetros de consulta que utilizaremos para filtrar las preguntas
        const { category, type, difficulty } = req.query;
        // Construimos un objeto que se utilizará como filtro para la búsqueda avanzada
        const searchQuery = {};
        // Si los parámetros de consulta tienen valores, se añaden al objeto
        if (category) searchQuery.category = category;
        if (type) searchQuery.type = type;
        if (difficulty) searchQuery.difficulty = difficulty;
        // Realizamos la búsqueda en la BBDD y pasamos el objeto como filtro para obtener solo
        // Las preguntas que cumplen con los criterios de búsqueda avanzada
        const questions = await Question.find(searchQuery);
        // Mostramos un mensaje de éxito en la consola con las preguntas encontradas
        console.log('Preguntas encontradas por búsqueda avanzada:');
        // Imprimimos solo el parámetro 'question' de cada pregunta
        questions.forEach(question => console.log(question.question));
        console.log(' ');
        // Enviamos una respuesta JSON con las preguntas guardadas
        res.json(questions);
    } catch (error) {
        // Si se produce un error dentro del bloque try lo imprimimos por consola para registrar el problema
        console.error(error);
        // Devolvemos una respuesta de error con el código 500 y un mensaje en JSON avisando que ha ocurrido un error
        res.status(500).json({ error: 'Error al realizar la búsqueda avanzada de preguntas' });
    }
};