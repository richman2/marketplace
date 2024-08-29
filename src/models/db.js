import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config({ path: './config.env' });
const username = process.env.USER;
const password = process.env.PASSWORD;
const host = process.env.HOST;
const dbName = process.env.DB;

export const sequelize = new Sequelize(dbName, username, password, {
  host,
  port: 3306,
  logging: console.log,
  dialect: 'mysql',
});
