import express from 'express';
import { login, signUp } from '../controller/auth/authentication.js';
export const router = express.Router();

router.post('/signup', signUp);
router.post('/login', login);
