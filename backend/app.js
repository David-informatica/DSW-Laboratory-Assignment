import express from "express"
//importamos la conexion con la bd y el enrutador
import db from "./database/db.js"
import userRoutes from "./routes/user.js"
import loginRoute from "./routes/authentication.js"

const app = express()

//middleware
app.use(express.json());
app.use('/api', userRoutes, loginRoute);


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

app.listen(3000, () => {
    console.log('Server UP running in http://localhost:3000/')
})