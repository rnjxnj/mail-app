import mongoose from 'mongoose';

const emailSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true,
  },
  recipient: [{
    type: String,
    required: true,
  }],
  subject: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  isRead: {
    type: Boolean,
    default: false, // Новые письма по умолчанию непрочитанные
  },
  attachment: [{
    filename: {
      type: String,
      required: true,
    },
    filepath: {
      type: String,
      required: true,
    },
    mimetype: {
      type: String,
    },
    size: {
      type: Number,
    },
  }],
  dateSent: {
    type: Date,
    default: Date.now,
  },
  direction: {
    type: String,
    enum: ['incoming', 'outgoing'],
    required: true,
  },
}, 
{ 
    timestamps: true 
}
);

const Email = mongoose.model('Email', emailSchema);
export default Email;