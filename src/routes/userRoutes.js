import express from 'express';
import { signUp } from '../controller/auth/authentication.js';
export const router = express.Router();

router.post('/signup', signUp);
