import express from 'express';
import cors from 'cors';
import userRoutes from './routes/user.routes';
import {log} from 'console';
import incidentsRoutes from './routes/incidents.routes';
import config from './configuration/config';

const app = express();

app.use(cors());
app.use(express.json());
app.use(userRoutes);
app.use(incidentsRoutes);

log('Server is starting...');

app.use((req, _, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.listen(config.port, () => {
  console.log(`Server is running on ${config.appUrl}`);
});
