import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 8 },
  role:     { type: String, enum: ['client', 'admin', 'writer', 'editor'], default: 'client' },
  avatar:   String,
  phone:    String,
  bio:      String,
  isVerified:    { type: Boolean, default: false },
  resetToken:    String,
  resetTokenExp: Date,
}, { timestamps: true })

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

userSchema.methods.comparePassword = async function(candidate) {
  return bcrypt.compare(candidate, this.password)
}

userSchema.methods.toJSON = function() {
  const obj = this.toObject()
  delete obj.password
  delete obj.resetToken
  delete obj.resetTokenExp
  return obj
}

export default mongoose.model('User', userSchema)
