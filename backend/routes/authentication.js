import express from 'express'
const router = express.Router()
import UserSchema from '../models/User.js'

//LOoin user
router.post('/login', async (req, res) => {
  const { email, password } = UserSchema(req.body);

  try {
    // Busca el usuario en la base de datos por nombre de usuario y password
    const usuario = await UserSchema.findOne({ email, password });

    // Si el usuario no existe o la password es incorrecta, devuelve un error
    if (!usuario) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Si el usuario existe y la password es correcta, devuelve un mensaje de éxito
    res.status(200).json({ mensaje: 'Inicio de sesión exitoso', usuario });

  } catch (error) {
    // Manejo de errores
    console.error(error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

//Register User
router.post('/register', (req, res) => {
  const user = UserSchema(req.body);
  user
    .save()
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
})

export default router;