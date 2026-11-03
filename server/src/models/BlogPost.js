import mongoose from 'mongoose'

const blogPostSchema = new mongoose.Schema({
  title:     { type: String, required: true },
  slug:      { type: String, required: true, unique: true },
  excerpt:   String,
  content:   { type: String, required: true },
  category:  String,
  tags:      [String],
  author:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  coverImage: String,
  readTime:  String,
  published: { type: Boolean, default: false },
  publishedAt: Date,
  views:     { type: Number, default: 0 },
}, { timestamps: true })

export default mongoose.model('BlogPost', blogPostSchema)
