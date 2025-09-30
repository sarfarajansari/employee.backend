import { Employee } from "../models/employee";
import { employeeService } from "../services/employee.service";
import { Request, Response } from "express";

const isEmployee = (data: any): data is Employee => {
  return (
    data &&
    typeof data.name === "string" &&
    typeof data.email_address === "string" &&
    typeof data.position === "string"
  );
};

export const createEmployee = async (req: Request, res: Response) => {
  const data = req.body;
  if (!isEmployee(data)) {
    return res.status(400).json({ error: "Invalid employee data" });
  }
  const employee = await employeeService.createEmployee(data);
  return res.status(201).json(employee);
};

export const getAllEmployees = async (req: Request, res: Response) => {
  const employees = await employeeService.getAllEmployees();
  return res.status(200).json(employees);
};

export const getEmployeeById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  try {
    const employee = await employeeService.getEmployeeById(id);
    return res.status(200).json(employee);
  } catch (error: Error | any) {
    return res.status(404).json({ error: error.message });
  }
};

export const updateEmployee = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const data = req.body;
  if (!isEmployee(data)) {
    return res.status(400).json({ error: "Invalid employee data" });
  }
  try {
    const updatedEmployee = await employeeService.updateEmployee(id, data);
    return res.status(200).json(updatedEmployee);
  } catch (error: Error | any) {
    return res.status(404).json({ error: error.message });
  }
};

export const deleteEmployee = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  try {
    await employeeService.deleteEmployee(id);
    return res.status(204).send();
  } catch (error: Error | any) {
    return res.status(404).json({ error: error.message });
  }
};
