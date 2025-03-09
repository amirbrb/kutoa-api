import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import userRoutes from './routes/user.routes';
import {log} from 'console';
import incidentsRoutes from './routes/incidents.routes';
import readConfiguration from './utils/configuration/readConfiguration';
dotenv.config();
const app = express();
const {appUrl, port} = readConfiguration();

console.log('appUrl', appUrl);
console.log('port', port);

app.use(cors());
app.use(express.json());
app.use(userRoutes);
app.use(incidentsRoutes);

log('Server is starting...');

app.use((req, _, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.listen(port, () => {
  console.log(`Server is running on ${appUrl}`);
});
