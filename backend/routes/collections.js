// routes/collections.js
import express from 'express';
import CollectionSchema from '../models/Collections.js';
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
  
  // Usar el middleware en rutas que necesiten autenticación
  router.post('/collections', authenticateToken, async (req, res) => {
      const { name } = req.body;
      try {
          const collection = new CollectionSchema({
            name,
            user: req.user.userId // Usar el ID de usuario extraído del token
          });
          const savedCollection = await collection.save();
          res.status(201).json(savedCollection);
      } catch (error) {
          res.status(500).json({ message: error.message });
      }
  });
  
  // Obtener solo las colecciones del usuario autenticado
  router.get('/collections', authenticateToken, async (req, res) => {
      try {
          const collections = await CollectionSchema.find({ user: req.user.userId }).populate('notes');
          res.json(collections);
      } catch (error) {
          res.status(500).json({ message: error.message });
      }
  });
  

// Update Collection - Asegúrate de que solo el usuario propietario pueda actualizar la colección
router.put('/collections/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { name, description, notes } = req.body;
    try {
        const updatedCollection = await CollectionSchema.findOneAndUpdate({
            _id: id,
            user: req.user.userId // Asegúrate de que la colección pertenezca al usuario
        }, { name, description, notes }, { new: true });

        if (!updatedCollection) {
            return res.status(404).json({ message: "Collection not found or user unauthorized" });
        }
        
        res.json(updatedCollection);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete Collection - Asegúrate de que solo el usuario propietario pueda eliminar la colección
router.delete('/collections/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    CollectionSchema
        .findOneAndDelete({
            _id: id,
            user: req.user.userId // Asegúrate de que la colección pertenezca al usuario
        })
        .then((data) => {
            if (!data) {
                return res.status(404).json({ message: "Collection not found or user unauthorized" });
            }
            res.json({ message: "Collection deleted" });
        })
        .catch((error) => res.status(500).json({ message: error.message }));
});


router.post('/collections/:collectionId/notes', authenticateToken, async (req, res) => {
    const { collectionId } = req.params;
    const noteData = req.body;

    try {
        const collection = await CollectionSchema.findOne({
            _id: collectionId,
            user: req.user.userId
        });

        if (!collection) {
            return res.status(404).json({ message: "Collection not found or user unauthorized" });
        }

        const note = new NotesSchema({
            ...noteData,
            user: req.user.userId
        });
        const savedNote = await note.save();

        collection.notes.push(savedNote._id);
        await collection.save();

        res.status(201).json(savedNote);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



export default router;
