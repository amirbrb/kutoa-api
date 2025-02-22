import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/user.routes';
import authRoutes from './routes/auth.route';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/users', userRoutes);
app.use('/auth', authRoutes);

app.use((req, res, next) => {
  const log = `${new Date().toISOString()} - ${req.method} ${req.url}`;
  console.log(log.trim());
  next();
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
