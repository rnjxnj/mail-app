import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: 'user',
    },
    contacts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
    }],
  }, 
  { 
    timestamps: true 
  },
);

const User = mongoose.model('User', userSchema);
export default User;