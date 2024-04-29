import express from "express"
import cors from 'cors'
//importamos la conexion con la bd y enrutadores
import db from "./database/db.js"
import userRoutes from "./routes/user.js"
import loginRoute from "./routes/authentication.js"
import notesRoute from "./routes/notes.js"
import dotenv from 'dotenv'

const app = express()

//middleware
dotenv.config();
app.use(cors())
app.use(express.json());
app.use('/api', userRoutes, loginRoute, notesRoute);


//Conexión con la base de datos
try {
    db()
} catch (error) {
    console.log(`El error de conexión es: ${error}`)
}

//RUTAS
app.get('/', (req, res) => {
    res.send('HOLA MUNDO')
})

app.listen(3001, () => {
    console.log('Server UP running in http://localhost:3001/')
})