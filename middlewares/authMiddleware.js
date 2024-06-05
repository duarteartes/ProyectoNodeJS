// Importamos los módulos necesarios
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

// Convertimos la función en una función basada en promesas, y nos permitirá usar await con verifyToken
const verifyToken = promisify(jwt.verify);

// Exportamos una función que es un middleWare de autentificación de tokens JWC
// Esta función recide 3 parámetros: La solicitud, la respuesta, y la función de Middleware siguiente en la cadena
exports.authenticateToken = async (req, res, next) => {
    // Se obtiene el token de la cabecera de autorización de la solicitud HTTP
    const token = req.headers.authorization;
    // Utilizamos una condición para verificar si existe un token en la cabecera de la autorización
    if (token && token.startsWith('Bearer')) {
        try {
            // Verificamos la validez del token
            const decoded = await verifyToken(token.split(' ')[1], process.env.JWT_SECRET);
            // Si el token es válido se decodifica y se almacena en req.user
            req.user = decoded;
            // Utilizamos la función next para pasar la solicitud al siguiente middleWare
            next();
        } catch (error) {
            // Si hay un error al verificar el token se muestra un mensaje por consola y se envía un JSON con el error
            console.error(error);
            return res.status(403).json({ error: 'Token de autenticación inválido' });
        }
    } else {
        // Si no se proporciona un token válido, se devuelve un JSON con un mensaje y el error
        return res.status(401).json({ error: 'Acceso no autorizado: se requiere un token de autenticación' });
    }
};