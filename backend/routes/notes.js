import express from 'express'
import NotesSchema from '../models/Notes.js'

const router = express.Router()

//CRUD NOTES
//--------------------
//Create Note
router.post('/CreateNotes', (req, res) => {
    const note = NotesSchema(req.body);
    note
        .save()
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
})

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

//Delete user
router.delete('/note/:id', (req, res) => {
    const { id } = req.params;
    NotesSchema
        .remove({ _id: id })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
})


export default router;