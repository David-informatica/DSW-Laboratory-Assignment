import mongoose from 'mongoose';

const collectionSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  notes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Notes'
  }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

const Collection = mongoose.model('Collection', collectionSchema);
export default Collection;
