// Importamos el módulo que es una biblioteca de creación de objetos de MongoDB
const mongoose = require('mongoose');

// Definimos una función para conectar la aplicación a la BBDD de MongoDB
const connectDB = async () => {
    try {
        // Utilizamos la URL de conexión almacenada en la variable de entorno
        await mongoose.connect(process.env.MONGODB_URI, {
            // Estas opciones están obsoletas al conectarse a la BBDD desde la version 4.0 del controlador
            // Las vamos a comentar, porque en mi versión no son necesarias, si te diera error, las descomentas
            //useNewUrlParser: true,
            //useUnifiedTopology: true,
        });
        // Si la conexión es buena se imprime un mensaje de éxito en el terminal
        console.log('Conectado a MongoDB');
        console.log(' ');
    } catch (error) {
        // Si el bloque try falla se muestra un mensaje en el terminal con el error
        console.error('Fallo al contectarse a MongoDB:', error);
    }
};

// Exportamos la función para que esté disponible en otros archivos de la aplicación
module.exports = connectDB;