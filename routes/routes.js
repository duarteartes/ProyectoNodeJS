// Importamos el módulo extress para la creación de app webs y APIs
const express = require('express');
// Creamos un enrutador para definir las rutas y manejar las solicitudes asociadas
const router = express.Router();
// Importamos los controladores y el middleWare necesarios para manejar las solicitudes
const userController = require('../controllers/userController');
const questionController = require('../controllers/questionController');
const authMiddleware = require('../middlewares/authMiddleware');

// Definimos las rutas para el registro de usuarios y el login
router.post('/register', userController.register);
router.post('/login', userController.login);

// Definimos las rutas para realizar las operaciones CRUD relacionadas con las preguntas
// Estas rutas están protegidas por el middleware, por lo que se debe proporcionar un token de autenticación
router.get('/questions', authMiddleware.authenticateToken, questionController.getAllQuestions);
router.post('/questions', authMiddleware.authenticateToken, questionController.createQuestion);
router.get('/questions/:id', authMiddleware.authenticateToken, questionController.getQuestionById);
router.put('/questions/:id', authMiddleware.authenticateToken, questionController.updateQuestion);
router.delete('/questions/:id', authMiddleware.authenticateToken, questionController.deleteQuestion);

// Definimos una ruta para la búsqueda avanzada
router.get('/advanced-search', authMiddleware.authenticateToken, questionController.advancedSearch);

// Definimos una ruta para obtener las preguntas de la API externa
router.get('/external-questions', questionController.getExternalQuestions);

// Exportamos el enrutador para que lo puedan utilizar otros archivos de la aplicación
module.exports = router;