import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Middleware para verificar el token y la autorización del usuario
const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        if (!user) return res.sendStatus(404);

        req.user = user;
        next();
    } catch (error) {
        return res.sendStatus(403);
    }
};

// Middleware para verificar si el usuario es administrador
const isAdmin = (req, res, next) => {
    if (!req.user.isAdmin) {
        return res.status(403).send('Access denied. Admins only.');
    }
    next();
};

// Rutas CRUD con control de acceso

// Crear usuario
router.post('/users', authenticateToken, isAdmin, async (req, res) => {
    try {
        const newUser = new User(req.body);
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Obtener todos los usuarios
router.get('/users', authenticateToken, isAdmin, async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Actualizar un usuario
router.put('/users/:id', authenticateToken, isAdmin, async (req, res) => {
    const { id } = req.params;
    const { name, email, password, isAdmin } = req.body;
    try {
        const updatedUser = await User.findByIdAndUpdate(id, { name, email, password, isAdmin }, { new: true });
        if (!updatedUser) {
            return res.status(404).send('User not found.');
        }
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Eliminar un usuario
router.delete('/users/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).send('User not found.');
        }
        res.status(200).send('User deleted.');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
