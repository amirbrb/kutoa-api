import {Response} from 'express';
import {incidentsDbService} from '../../database/incidents/incidents.db.service';
import {Incident} from '../../models/incidents.models';
import {IncidentsTableRow, IncidentsTableRowWithUserDetails} from '../../database/incidents/incidents.db.table';
import {AuthRequest} from '../../models/request.types';

const toUI = (incident: IncidentsTableRowWithUserDetails | IncidentsTableRow): Incident => ({
  id: incident.id,
  title: incident.title,
  description: incident.content,
  status: incident.status,
  createdAt: incident.created_at,
  userDetails: 'userDetails' in incident && {
    id: incident.user_id,
    firstName: incident.userDetails.firstName,
    lastName: incident.userDetails.lastName,
    profileImage: incident.userDetails.profileImage,
  },
});

async function getIncidentsByLocation(req: AuthRequest, res: Response) {
  try {
    const {lat, lon} = req.params;

    if (!lat || !lon || isNaN(+lat) || isNaN(+lon)) {
      res.status(400).json({message: 'Latitude and longitude are required'});
      return;
    }

    const incidents = await incidentsDbService.getIncidentsWithinRange(+lat, +lon, req.user.id);
    res.status(200).json({data: incidents.map(toUI)});
  } catch (error) {
    res.status(500).json({message: 'Error fetching incidents'});
  }
}

async function addIncident(req: AuthRequest, res: Response) {
  try {
    const {title, description, latitude, longitude} = req.body;
    const incidentId = await incidentsDbService.addIncident(title, description, req.user.id, latitude, longitude);
    res.status(200).json({data: incidentId});
  } catch (error) {
    res.status(500).json({message: 'Error adding incident'});
  }
}

export {getIncidentsByLocation, addIncident};
