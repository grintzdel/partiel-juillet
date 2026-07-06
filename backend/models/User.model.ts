import mongoose, { Schema, type HydratedDocument, type Model } from 'mongoose'

export interface IUser {
  name: string
  email: string
  passwordHash: string
  createdAt: Date
  updatedAt: Date
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      unique: true,
      match: [/^.+@.+\..+$/, 'Email format is invalid'],
    },
    passwordHash: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

userSchema.methods.toJSON = function toJSON(this: HydratedDocument<IUser>) {
  const obj = this.toObject() as unknown as Record<string, unknown>
  delete obj.passwordHash
  delete obj.__v
  return obj
}

export const User: Model<IUser> = mongoose.model<IUser>('User', userSchema)

export default User
