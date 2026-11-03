import mongoose from 'mongoose'

const consultationSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true },
  phone:    String,
  service:  String,
  genre:    String,
  budget:   String,
  message:  String,
  status:   { type: String, enum: ['pending', 'scheduled', 'completed', 'cancelled'], default: 'pending' },
  scheduledAt: Date,
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true })

export default mongoose.model('Consultation', consultationSchema)
