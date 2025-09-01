export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  dateCreated: string;
}

export const clients: Client[] = [
  {
    id: "CL000001",
    firstName: "Anna",
    lastName: "Kowalska",
    dateCreated: "2025-08-31T10:20:00Z",
  },
  {
    id: "CL000002",
    firstName: "John",
    lastName: "Chen",
    dateCreated: "2025-08-31T10:05:00Z",
  },
  {
    id: "CL000003",
    firstName: "Maria",
    lastName: "Nowak",
    dateCreated: "2025-08-30T09:15:00Z",
  },
  {
    id: "CL000004",
    firstName: "Wojtek",
    lastName: "Kowalczyk",
    dateCreated: "2025-08-29T14:45:00Z",
  },
];
