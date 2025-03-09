interface IncidentUserDetails {
  id: number;
  firstName: string;
  lastName: string;
  profileImage: string;
}

interface Incident {
  id: string;
  title: string;
  description: string;
  status: IncidentStatus;
  createdAt: Date;
  userDetails: IncidentUserDetails;
}

enum IncidentStatus {
  Open = 'open',
  Closed = 'closed',
}

enum IncidentStatusValue {
  Open = 1,
  Closed = 2,
}

export {Incident, IncidentStatus, IncidentUserDetails, IncidentStatusValue};
