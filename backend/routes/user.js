import express from 'express'
import UserSchema from '../models/User.js'

const router = express.Router()

//CRUD USERS
//--------------------

//Create users
router.post('/users', (req, res) => {
    const user = UserSchema(req.body);
    user
        .save()
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
})

//Get users
router.get('/users', (req, res) => {
    UserSchema
        .find()
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
})

//Update user
router.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const { name, email, password } = req.body;
    UserSchema
        .updateOne({ _id: id }, { $set: { name, email, password } })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
})

//Delete user
router.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    UserSchema
        .remove({ _id: id })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
})

export default router;