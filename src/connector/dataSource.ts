import { DataSource } from "typeorm";
import { Employee } from "../models/employee";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "database.sqlite",
  synchronize: true, // Only for development
  logging: false,
  entities: [Employee],
  migrations: [],
  subscribers: [],
});


