import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import userRoutes from './routes/user.routes';
import {log} from 'console';
import {emailService} from './messaging/email.service';
import {generateWelcomeEmail} from './controllers/usersController/users.controller.consts';
import incidentsRoutes from './routes/incidents.routes';
import readConfiguration from './utils/configuration/readConfiguration';
dotenv.config();
const app = express();
const {appUrl, port} = readConfiguration();

app.use(cors());
app.use(express.json());
app.use(userRoutes);
app.use(incidentsRoutes);

log('Server is starting...');

app.get('/send-email', async (req, res) => {
  await emailService.sendEmail({
    to: 'amirbrb@gmail.com',
    subject: 'Test Email',
    text: generateWelcomeEmail('Amir', 'amirbrb@gmail.com', '1234567890'),
  });
  res.send('Email sent');
});

app.listen(port, () => {
  console.log(`Server is running on ${appUrl}`);
});
