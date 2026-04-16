import bcrypt from 'bcryptjs';
import { authModel } from '../models/authModel.js';
import { signToken } from '../utils/jwt.js';
import { createHttpError } from '../utils/httpError.js';

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw createHttpError(400, 'Email and password are required.');
    }

    const user = await authModel.findUserByEmail(email);

    if (!user) {
      throw createHttpError(401, 'Invalid credentials.');
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      throw createHttpError(401, 'Invalid credentials.');
    }

    const token = signToken({ id: user.id, email: user.email, role: user.role, name: user.name });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res) => {
  res.json({ user: req.user });
};
