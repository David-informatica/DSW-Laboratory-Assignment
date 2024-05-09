import mongoose from "mongoose";

const NotesSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  text: {
    type: String
  },
  image: {
    type: String
  },
  user: {
    type: mongoose.Schema.Types.ObjectId, // Tipo ObjectId para referencias
    ref: 'User', // Referencia al modelo User
    required: true
  }
}); 

const note = mongoose.model('Notes', NotesSchema);
export default note;
