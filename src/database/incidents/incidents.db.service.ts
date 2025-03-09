import {RowDataPacket} from 'mysql2';
import db from '../../db';
import {incidentsTable, IncidentsTableRow, IncidentsTableRowWithUserDetails} from './incidents.db.table';
import {usersTable} from '../users/users.db.table';
import {IncidentStatusValue} from '../../models/incidents.models';

function readIncident(row: RowDataPacket): IncidentsTableRow {
  if (!row) return null;

  const {id, user_id, title, content, created_at, status, latitude, longitude} = row;
  return {
    id,
    user_id,
    title,
    content,
    created_at,
    status,
    latitude,
    longitude,
  };
}

function readIncidentWithUserDetails(row: RowDataPacket): IncidentsTableRowWithUserDetails {
  if (!row) return null;

  return {
    ...readIncident(row),
    userDetails: {
      firstName: row[usersTable.columns.firstName],
      lastName: row[usersTable.columns.lastName],
      profileImage: row[usersTable.columns.profileImage],
    },
  };
}

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
}

async function getIncidentsWithinRange(lat: number, lon: number, userId: number, range: number = 5): Promise<IncidentsTableRowWithUserDetails[]> {
  try {
    const [rows] = await db.query<RowDataPacket[]>(
      `SELECT incidents.*, 
          users.${usersTable.columns.firstName}, 
          users.${usersTable.columns.lastName}, 
          users.${usersTable.columns.profileImage} 
      FROM ${incidentsTable.tableName} incidents 
      INNER JOIN ${usersTable.tableName} users ON incidents.user_id = users.id
      WHERE incidents.user_id <> ?`,
      [userId],
    );

    return rows
      .map((row) => readIncidentWithUserDetails(row))
      .filter((incident) => {
        const distance = haversineDistance(lat, lon, incident.latitude, incident.longitude);
        return distance <= range;
      });
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to fetch incidents within range: ${error}`);
  }
}

async function addIncident(title: string, description: string, userId: number, latitude: number, longitude: number): Promise<number> {
  try {
    const createdAt = new Date();
    const [result] = await db.query<RowDataPacket[]>(
      `INSERT INTO ${incidentsTable.tableName} 
        (${incidentsTable.columns.title}, 
          ${incidentsTable.columns.content}, 
          ${incidentsTable.columns.status}, 
          ${incidentsTable.columns.userId}, 
          ${incidentsTable.columns.latitude}, 
          ${incidentsTable.columns.longitude}, 
          ${incidentsTable.columns.createdAt}) VALUES (?, ?, ?, ?, ?, ?, ?);
          SELECT LAST_INSERT_ID();`,
      [title, description, IncidentStatusValue.Open, userId, latitude, longitude, createdAt],
    );
    return result[0].insertId;
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to add incident: ${error}`);
  }
}

export const incidentsDbService = {
  getIncidentsWithinRange,
  addIncident,
};
