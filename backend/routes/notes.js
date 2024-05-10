import express from 'express';
import NotesSchema from '../models/Notes.js';
import jwt from 'jsonwebtoken';


const router = express.Router();

// Middleware para verificar el token y extraer el usuario
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);
  
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
};



// Crear una nueva nota asociada al usuario autenticado
router.post('/Notes', authenticateToken, async (req, res) => {
    const { name, text, image } = req.body;
    try {
        const note = new NotesSchema({
            name, text, image,
            user: req.user.userId // Asignar el usuario extraído del token
        });
        const savedNote = await note.save();
        res.status(201).json(savedNote);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Obtener todas las notas del usuario autenticado
router.get('/Notes', authenticateToken, (req, res) => {
    NotesSchema
        .find({ user: req.user.userId })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Actualizar una nota específica del usuario autenticado
router.put('/note/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { name, text, image } = req.body;
    NotesSchema
        .findOneAndUpdate({_id: id, user: req.user.userId}, { $set: { name, text, image } }, { new: true })
        .then((updatedNote) => {
            if (!updatedNote) {
                return res.status(404).json({ message: "Note not found or user unauthorized" });
            }
            res.json(updatedNote);
        })
        .catch((error) => res.status(500).json({ message: error }));
});

// Eliminar una nota específica del usuario autenticado
router.delete('/note/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    NotesSchema
        .findOneAndDelete({_id: id, user: req.user.userId})
        .then((deletedNote) => {
            if (!deletedNote) {
                return res.status(404).json({ message: "Note not found or user unauthorized" });
            }
            res.json({ message: "Note deleted" });
        })
        .catch((error) => res.status(500).json({ message: error }));
});

export default router;
