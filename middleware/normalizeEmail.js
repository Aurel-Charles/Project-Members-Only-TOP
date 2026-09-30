// middleware/normalize.js
import { body } from 'express-validator';

export const normalizeUsername = body('username')
  .trim()
  .normalizeEmail({ gmail_remove_dots: false });