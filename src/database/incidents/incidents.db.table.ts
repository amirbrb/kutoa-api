import {IncidentStatus} from '../../models/incidents.models';

export const incidentsTable = {
  tableName: 'incidents',
  columns: {
    id: 'id',
    userId: 'user_id',
    title: 'title',
    content: 'content',
    createdAt: 'created_at',
    status: 'status',
    latitude: 'latitude',
    longitude: 'longitude',
  },
};

export interface IncidentsTableRow {
  id: string;
  user_id: number;
  title: string;
  content: string;
  created_at: Date;
  status: IncidentStatus;
  latitude: number;
  longitude: number;
}

export interface IncidentsTableRowWithUserDetails extends IncidentsTableRow {
  userDetails: {
    firstName: string;
    lastName: string;
    profileImage: string;
  };
}
