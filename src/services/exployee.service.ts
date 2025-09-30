import { Repository } from "typeorm";
import { AppDataSource } from "../connector/dataSource";
import { Employee } from "../models/employee";

export class EmployeeService {
  private employeeRepository: Repository<Employee>;

  constructor() {
    this.employeeRepository = AppDataSource.getRepository(Employee);
  }

  async getAllEmployees(): Promise<Employee[]> {
    return this.employeeRepository.find();
  }

  async getEmployeeById(id: number): Promise<Employee> {
    const employee = await this.employeeRepository.findOneBy({ id });
    if (!employee) {
      throw new Error("Employee not found");
    }
    return employee;
  }

  async createEmployee(data: Partial<Employee>): Promise<Employee> {
    const newEmployee = this.employeeRepository.create(data);
    return this.employeeRepository.save(newEmployee);
  }
  async updateEmployee(
    id: number,
    data: Partial<Employee>
  ): Promise<Employee | null> {
    const employee = await this.employeeRepository.findOneBy({ id });
    if (!employee) {
      throw new Error("Employee not found");
    }
    this.employeeRepository.merge(employee, data);
    return this.employeeRepository.save(employee);
  }
  async deleteEmployee(id: number): Promise<void> {
    const result = await this.employeeRepository.delete(id);
    if (result.affected === 0) {
      throw new Error("Employee not found");
    }
    return;
  }
}
