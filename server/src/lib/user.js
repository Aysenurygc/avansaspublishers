import bcrypt from 'bcryptjs'

export const hashPassword = (plain) => bcrypt.hash(plain, 12)

export const comparePassword = (plain, hash) => bcrypt.compare(plain, hash)

/** Fields safe to return to a client — never includes password or reset tokens. */
export const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  avatar: true,
  phone: true,
  bio: true,
  isVerified: true,
  createdAt: true,
  updatedAt: true,
}
