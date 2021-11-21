import { Schema } from 'mongoose';
export const EmployeeSchema = new Schema({
  username: String,
  anumber: String,
  team: String,
  location: String,
  squad: String,
});
