import express from 'express';
import cors from 'cors';
import userRoutes from './routes/user.routes';
import {log} from 'console';
import incidentsRoutes from './routes/incidents.routes';
import config from './configuration/config';
import {emailService} from './messaging/email.service';
import {generateWelcomeEmail} from './messaging/utils/generateWelcomeEmail';

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

app.get('/email', (req, res) => {
  log(req.headers);
  emailService.sendEmail({
    to: 'amirbrb@gmail.com',
    subject: 'Welcome to the Kutoa Community! 🎉',
    text: generateWelcomeEmail('Amir', 'amirbrb@gmail.com', '1234567890', req.headers.origin),
  });
  res.send('Email sent');
});

app.listen(config.port, () => {
  console.log(`Server is running on ${config.appUrl}`);
});
