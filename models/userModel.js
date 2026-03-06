import mongoose from 'mongoose';
import isEmail from 'validator/lib/isEmail.js';

const { Schema, model } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name'],
    trim: true,
    maxlength: [60, 'A user name must have less or equal then 50 characters'],
  },
  email: {
    type: String,
    required: [true, 'A user must have a email'],
    unique: true,
    lowercase: true,
    validate: [isEmail, 'Please provide a valid email'],
    maxlength: [
      256,
      'A user email must have less or equal them 256 characters',
    ],
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your email'],
  },
});

const User = model('User', userSchema);

export default User;
