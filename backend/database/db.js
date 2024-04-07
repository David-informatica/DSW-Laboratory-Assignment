import mongoose from "mongoose";

const DB_URI = 'mongodb+srv://jesuusgp14:87392002@dswdb.dlxmr30.mongodb.net/?retryWrites=true&w=majority&appName=dswDB';

const connect = () => {
    mongoose.connect(DB_URI, {
        //TODO: opciones adicionales
    }).then(() => {
        console.log('Conexion con la base de datos correcta');
    }).catch((err) => {
        console.error('DB: ERROR !!', err);
    });
}

export default connect;

