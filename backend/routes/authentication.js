import express from 'express'
const router = express.Router()
import UserSchema from '../models/User.js'

// Login user
router.post('/login', async (req, res) => {
  const { email, password } = req.body; // Asegúrate de extraer directamente desde req.body

  try {
    // Busca el usuario en la base de datos por email y password
    const user = await UserSchema.findOne({ email, password });

    // Si el usuario no existe o la contraseña es incorrecta, devuelve un error
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Si el usuario existe y la contraseña es correcta, devuelve los datos del usuario
    // Asegúrate de que la información sensible no sea devuelta
    const userData = {
      name: user.name, // Asumiendo que tienes un campo 'name' en tu modelo
      email: user.email // y un campo 'email'
    };

    res.status(200).json({ message: 'Login successful', user: userData });
  } catch (error) {
    // Manejo de errores
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Register User
router.post('/register', async (req, res) => {
  const newUser = new UserSchema(req.body);
  try {
    const savedUser = await newUser.save();
    res.status(201).json({ message: 'User registered', user: { name: savedUser.name, email: savedUser.email }});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error registering user' });
  }
});

export default router;
