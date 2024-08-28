import express from 'express';
import session from 'express-session';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { router as userRouter } from './src/routes/userRoutes.js';
import handleError from './src/errorHandling.js';
import morgan from 'morgan';
export const app = express();
app.use(express.json());
app.use(morgan('dev'));
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use('/api/v1/user', userRouter);

app.all("*", (req, res, next) => {
  res.send('this route does not found');
});
app.use(handleError);
