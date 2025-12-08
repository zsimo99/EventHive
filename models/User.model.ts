import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

 export interface IUser extends Document {
  avatar?: string;
  userName: string;
  email: string;
  password: string;
  refreshToken?: string;
  role: 'admin' | 'user' | 'organizer';
  createdAt: Date;
  updatedAt: Date;
  emailVerified: boolean;
  emailVerificationToken?: string;
  comparePassword(enteredPassword: string): Promise<boolean>;
  generateTokens(): { accessToken: string; refreshToken: string };
}

const userSchema = new Schema<IUser>(
  {
    avatar: {
      type: String,
      default: null,
    },
    userName: {
      type: String,
      required: [true, 'Username is required'],
      trim: true,
      minlength: [3, 'Username must be at least 3 characters long'],
      maxlength: [30, 'Username must not exceed 30 characters'],
      match: [/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false,
    },
    refreshToken: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: {
        values: ['admin', 'user', 'organizer'],
        message: 'Role must be one of: admin, user, or organizer',
      },
      default: 'user',
    },
    emailVerified:{
      type: Boolean,
      default: false,
    },
    emailVerificationToken:{
      type: String,
      default: null,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};
userSchema.methods.generateTokens = function () {
  const payload = { _id: this._id };

  // Access token: short-lived
  const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "15m", // 15 minutes
  });

  // Refresh token: long-lived
  const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: "7d", // 7 days
  });

  return { accessToken, refreshToken };
};

const User : Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
