import express from 'express';
import {getIncidentsByLocation, addIncident} from '../controllers/incidentsController/incidents.controller';
import {authenticateUser} from '../controllers/controller.base';

const router = express.Router();

router.get('/incidents/location/:lat/:lon', authenticateUser, getIncidentsByLocation);
router.post('/incidents', authenticateUser, addIncident);

export default router;
