import mongoose from "mongoose";

// Esquema para el modelo User
const NotesSchema = mongoose.Schema({

  name: {
    type: String,
    requiered: true,
    unique: true
  },
  text: {
    type: String
  },
  image: {
    type: String
  }
}); 

// Creación del modelo User basado en el esquema y exportacion
const note = mongoose.model('Notes', NotesSchema);
export default note
