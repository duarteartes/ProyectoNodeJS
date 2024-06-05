// Importamos este módulo para construir aplicaciones web y APIs
const express = require('express');
// Importamos este módulo para configurar variables de entorno como puertos, claves secretas, etc
const dotenv = require('dotenv');
// Importamos el módulo con la lógica para conectar la aplicación a la BBDD
const connectDB = require('./database/dbConfig');
// Importamos el módulo con las definiciones de rutas de la API de la aplicación
const routes = require('./routes/routes');

// Cargamos las variables de entorno al inicio de la app para que estén disponibles en todo el código
dotenv.config();
// Creamos una instancia de la aplicación express
const app = express();
// Llamamos a esta función para establecer la conexión a la BBDD
connectDB();
// Añadimos un middleware para procesar el cuerpo de la solicitudes en formato JSON
// Con esto la app podrá recibir y procesar datos
app.use(express.json());
// Añadimos las rutas definidas en el módulo routes precedidas por '/api'
app.use('/api', routes);
// Definimos el puerto donde se escucharán las solicitudes
// Utiliza primeramente una variable si está definida, sino lo está se utiliza el puerto 3000 por defecto
const PORT = process.env.PORT || 3000;

// Se inicia el servidor y se escucha en el puerto definido por PORT
app.listen(PORT, () => {
    console.log(' ');
    console.log(`Servidor ejecutándose en el puerto: ${PORT}`);
});