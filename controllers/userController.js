// Importamos los módulos necesarios
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const User = require('../models/user');

// Definimos un esquema de validación para el registro de usuarios utilizando Joi
const registerSchema = Joi.object({
    // Especificamos las reglas de validación para el registro de usuarios
    username: Joi.string().alphanum().min(4).max(20).required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z]\\w{5,15}$')).required(),
});

// Definimos un esquema de validación para el login de usuarios utilizando Joi
const loginSchema = Joi.object({
    // Especificamos las reglas de validación para el logueo de usuarios
    username: Joi.string().alphanum().min(4).max(20).required(),
    password: Joi.string().required(),
});

// Definimos una función de controlador para el registro de usuarios
exports.register = async (req, res) => {
    try {
        // Validamos los datos de entrada según el esquema definido
        const { error } = registerSchema.validate(req.body);
        if (error) {
            // Si hay un error de validación devolvemos un mensaje de error detallando el problema
            return res.status(400).json({ error: error.details[0].message });
        }
        // Si la validación es buena procedemos
        const { username, password } = req.body;
        // Buscamos si ya existe un usuario con el mismo username en la BBDD
        let user = await User.findOne({ username });
        if (user) {
            // Si ya hay un usuario con el mismo username devolvemos un mensaje de error
            return res.status(400).json({ error: 'El usuario ya existe' });
        }
        // Si el usuario no existe procedemos a encriptar la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);
        // Creamos un nuevo usuario con su username y la contraseña encriptada
        user = new User({ username, password: hashedPassword });
        // Guardamos el usuario en la BBDD
        await user.save();
        // Generamos el token que tendrá el usuario que se acaba de registrar y expirará en 8 horas
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '8h'
        });
        // Mostramos un mensaje en el terminal avisando que se ha creado el usuario correctamente
        console.log('Usuario registrado:', user.username);
        console.log(' ');
        // Devolvemos una respuesta con un JSON que contiene el token que se ha generado
        res.json({ token });
    } catch (error) {
        // Si falla el bloque try devolvemos un mensaje de error y registramos ese error
        console.error(error);
        res.status(500).json({ error: 'Error en el registro de usuario' });
    }
};

// Definimos una función de controlador para el logueo de usuarios
exports.login = async (req, res) => {
    try {
        // Validamos los datos de entrada según el esquema definido
        const { error } = loginSchema.validate(req.body);
        if (error) {
            // Si hay un error de validación devolvemos un mensaje de error detallando el problema
            return res.status(400).json({ error: error.details[0].message });
        }
        // Si la validación es buena procedemos a extraer el username y la contraseña del body
        const { username, password } = req.body;
        // Buscamos en la BBDD si existe un usuario con el mismo username proporcionados
        const user = await User.findOne({ username });
        if (!user) {
            // Si no se encuentra un usuario con el mismo username se devuelve un JSON con el error
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }
        // Comparamos la contraseña proporcionada con la contraseña almacenada en la base de datos
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            // Si las contraseñas no coinciden, devolvemos un JSON con el error de credenciales inválidas
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }
        // Si la validación es exitosa, generamos un token nuevo para el usuario que expirará en 8 horas
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '8h'
        });
        // Mostrmos un mensaje de éxito en la consola
        console.log('Usuario inició sesión:', user.username);
        console.log(' ');
        // Mandamos una respuesta en JSON con el nuevo token generado
        res.json({ token });
    } catch (error) {
        // Si falla el bloque try devolvemos un mensaje de error y registramos ese error
        console.error(error);
        res.status(500).json({ error: 'Error en el inicio de sesión' });
    }
};