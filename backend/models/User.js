import mongoose from "mongoose";

// Esquema para el modelo User
const UserSchema = mongoose.Schema({

  name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true // Asegura que el email sea único en la colección
  },
  password: {
    type: String,
    required: true
  }
}); 

// Creación del modelo User basado en el esquema y exportacion
const user = mongoose.model('User', UserSchema);
export default user 
