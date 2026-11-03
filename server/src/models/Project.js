import mongoose from 'mongoose'

const milestoneSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: String,
  dueDate:     Date,
  completed:   { type: Boolean, default: false },
  completedAt: Date,
}, { timestamps: true })

const messageSchema = new mongoose.Schema({
  sender:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: { type: String, required: true },
  files:   [String],
}, { timestamps: true })

const projectSchema = new mongoose.Schema({
  client:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  team:        [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  title:       { type: String, required: true },
  service:     { type: String, required: true },
  genre:       String,
  wordCount:   Number,
  status:      { type: String, enum: ['pending', 'active', 'review', 'revision', 'completed', 'paused'], default: 'pending' },
  progress:    { type: Number, min: 0, max: 100, default: 0 },
  startDate:   Date,
  dueDate:     Date,
  package:     { type: String, enum: ['essentials', 'professional', 'premier', 'custom'] },
  price:       Number,
  milestones:  [milestoneSchema],
  messages:    [messageSchema],
  files:       [{ name: String, url: String, uploadedAt: Date, uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } }],
  notes:       String,
}, { timestamps: true })

export default mongoose.model('Project', projectSchema)
