import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/user.routes';
import {log} from 'console';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';

app.use(cors());
app.use(express.json());
app.use(userRoutes);

log('Server is starting...');

app.use((req, _, next) => {
  const logMessage = `${new Date().toISOString()} - ${req.method} ${req.url}`;
  log(logMessage.trim());
  next();
});

app.listen(port, () => {
  console.log(`Server is running on ${host}:${port}`);
});
