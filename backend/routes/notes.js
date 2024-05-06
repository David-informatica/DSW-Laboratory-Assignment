import express from 'express'
import NotesSchema from '../models/Notes.js'

const router = express.Router()

//CRUD NOTES
//--------------------
//Create Note
router.post('/Notes', async (req, res) => {
    try {
        const note = new NotesSchema(req.body);
        const savedNote = await note.save();
        res.status(201).json(savedNote);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


//Get Notes
router.get('/Notes', (req, res) => {
    NotesSchema
        .find()
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
})

//Update Notes
router.put('/note/:id', (req, res) => {
    const { id } = req.params;
    const { name, text, image } = req.body;
    NotesSchema
        .updateOne({ _id: id }, { $set: { name, text, image } })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
})

//Delete note
router.delete('/note/:id', (req, res) => {
    const { id } = req.params;
    NotesSchema
        .deleteOne({ _id: id })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error.message }));
});



export default router;