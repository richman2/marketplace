import { app } from './main.js';
import dotenv from 'dotenv';
import { sequelize } from './src/models/index.js';

dotenv.config({ path: './config.env' });

const PORT = process.env.PORT || 3000;
// sequelize
//   .sync({ force: false, alter: true })
//   .then(() => {
//     console.log('connected');
//     app.listen(3000, () => {
//       console.log('server is run');
//     });
//   })
//   .catch((err) => {
//     console.log(err);
//   });
app.listen(PORT, '0.0.0.0', () => {
  console.log(`server is listening on port ${PORT}`);
});
