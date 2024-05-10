import express from 'express'
import UserSchema from '../models/User.js'
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'


dotenv.config();
const router = express.Router()

// Login user
router.post('/login', async (req, res) => {
  const { email, password } = req.body; 

  try {
    // Busca el usuario en la base de datos por email y password
    const user = await UserSchema.findOne({ email, password });

    // Si el usuario no existe o la contraseña es incorrecta, devuelve un error
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Genera el token JWT con los datos del usuario
    const token = jwt.sign(
      { userId: user._id, email: user.email }, // PAYLOAD del token
      process.env.JWT_SECRET, // La clave secreta para firmar el token
      { expiresIn: '1h' } // El token expira en 1 hora
    );

    // Si el usuario existe y la contraseña es correcta, devuelve el token generado
    res.status(200).json({
      message: 'Login successful',
      token: token, // Envía el token al cliente
      user: { name: user.name, email: user.email } // Envía también los datos del usuario
    });
  } catch (error) {
    // Manejo de errores
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Register User
router.post('/register', async (req, res) => {
  const { name, email, password, isAdmin } = req.body;

  // Validación básica
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  try {
    // Verificar si el usuario ya existe
    const existingUser = await UserSchema.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Crear un nuevo usuario sin encriptar la contraseña
    const newUser = new UserSchema({
      name,
      email,
      password, // Almacenar la contraseña tal como se recibe (no seguro)
      isAdmin: isAdmin || false  // Asegura que isAdmin sea false por defecto si no se proporciona
    });

    // Guardar el usuario
    const savedUser = await newUser.save();
    res.status(201).json({ message: 'User registered', user: { name: savedUser.name, email: savedUser.email }});

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error registering user' });
  }
});


router.get('/userdata', (req, res) => {
  const token = req.headers.authorization.split(' ')[1]; // Extraer el token del header
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    UserSchema.findById(decoded.userId)
      .then(user => {
        if (user) {
          res.json({ user: { name: user.name, email: user.email, isAdmin: user.isAdmin } });
        } else {
          res.status(404).json({ message: "User not found" });
        }
      })
      .catch(err => res.status(500).json({ message: "Error retrieving user" }));
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
});


export default router;
