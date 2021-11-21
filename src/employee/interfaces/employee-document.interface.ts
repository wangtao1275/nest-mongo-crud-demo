import { Document } from 'mongoose';

export interface EmployeeDoc extends Document {
  username: string;
  anumber: string;
  team: string;
  location: string;
  squad: string;
}
