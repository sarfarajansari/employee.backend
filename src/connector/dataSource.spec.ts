import { DataSource } from "typeorm";
import { AppDataSource } from "./dataSource";
import { Employee } from "../models/employee";

describe("AppDataSource", () => {
  it("should be an instance of DataSource", () => {
    expect(AppDataSource).toBeInstanceOf(DataSource);
  });

  it("should be configured with sqlite type", () => {
    expect(AppDataSource.options.type).toBe("sqlite");
  });

  it("should use database.sqlite as database file", () => {
    expect(AppDataSource.options.database).toBe("database.sqlite");
  });

  it("should have synchronize enabled", () => {
    expect(AppDataSource.options.synchronize).toBe(true);
  });

  it("should have logging disabled", () => {
    expect(AppDataSource.options.logging).toBe(false);
  });

  it("should include Employee entity", () => {
    expect(AppDataSource.options.entities).toContain(Employee);
  });

  it("should have empty migrations array", () => {
    expect(AppDataSource.options.migrations).toEqual([]);
  });

  it("should have empty subscribers array", () => {
    expect(AppDataSource.options.subscribers).toEqual([]);
  });

  it("should not be initialized by default", () => {
    expect(AppDataSource.isInitialized).toBe(false);
  });
});