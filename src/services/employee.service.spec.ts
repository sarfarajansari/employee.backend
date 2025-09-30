import { Repository } from "typeorm";
import { AppDataSource } from "../connector/dataSource";
import { Employee } from "../models/employee";
import { EmployeeService } from "./employee.service";

// Mock the AppDataSource
jest.mock("../connector/dataSource", () => ({
  AppDataSource: {
    getRepository: jest.fn(),
  },
}));

describe("EmployeeService", () => {
  let mockRepository: jest.Mocked<Repository<Employee>>;

  beforeEach(() => {
    mockRepository = {
      find: jest.fn(),
      findOneBy: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      merge: jest.fn(),
      delete: jest.fn(),
    } as any;

    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllEmployees", () => {
    it("should return all employees", async () => {
      const mockEmployees: Employee[] = [
        {
          id: 1,
          name: "John Doe",
          email_address: "john@example.com",
          position: "Developer",
        } as Employee,
        {
          id: 2,
          name: "Jane Smith",
          email_address: "jane@example.com",
          position: "Manager",
        } as Employee,
      ];

      mockRepository.find.mockResolvedValue(mockEmployees);
      const employeeService = new EmployeeService();
      const result = await employeeService.getAllEmployees();

      expect(mockRepository.find).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockEmployees);
    });

    it("should return empty array when no employees exist", async () => {
      mockRepository.find.mockResolvedValue([]);
      const employeeService = new EmployeeService();
      const result = await employeeService.getAllEmployees();

      expect(mockRepository.find).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
    });
  });

  describe("getEmployeeById", () => {
    it("should return employee when found", async () => {
      const mockEmployee = {
        id: 1,
        name: "John Doe",
        email_address: "john@example.com",
        position: "Developer",
      } as Employee;

      mockRepository.findOneBy.mockResolvedValue(mockEmployee);
      const employeeService = new EmployeeService();
      const result = await employeeService.getEmployeeById(1);

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual(mockEmployee);
    });

    it("should throw error when employee not found", async () => {
      mockRepository.findOneBy.mockResolvedValue(null);
      const employeeService = new EmployeeService();
      await expect(employeeService.getEmployeeById(999)).rejects.toThrow(
        "Employee not found"
      );
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 999 });
    });
  });

  describe("createEmployee", () => {
    it("should create and return new employee", async () => {
      const employeeData = {
        name: "New Employee",
        email_address: "new@example.com",
        position: "Intern",
      };
      const createdEmployee = { id: 3, ...employeeData } as Employee;

      mockRepository.create.mockReturnValue(createdEmployee);
      mockRepository.save.mockResolvedValue(createdEmployee);
      const employeeService = new EmployeeService();
      const result = await employeeService.createEmployee(employeeData);

      expect(mockRepository.create).toHaveBeenCalledWith(employeeData);
      expect(mockRepository.save).toHaveBeenCalledWith(createdEmployee);
      expect(result).toEqual(createdEmployee);
    });

    it("should create employee with partial data", async () => {
      const partialData = { name: "Partial Employee" };
      const createdEmployee = { id: 4, ...partialData } as Employee;

      mockRepository.create.mockReturnValue(createdEmployee);
      mockRepository.save.mockResolvedValue(createdEmployee);
      const employeeService = new EmployeeService();
      const result = await employeeService.createEmployee(partialData);

      expect(mockRepository.create).toHaveBeenCalledWith(partialData);
      expect(result).toEqual(createdEmployee);
    });
  });

  describe("updateEmployee", () => {
    it("should update and return employee when found", async () => {
      const existingEmployee = {
        id: 1,
        name: "Old Name",
        email_address: "old@example.com",
        position: "Developer",
      } as Employee;
      const updateData = { name: "Updated Name", position: "Senior Developer" };
      const updatedEmployee = {
        ...existingEmployee,
        ...updateData,
      } as Employee;

      mockRepository.findOneBy.mockResolvedValue(existingEmployee);
      mockRepository.save.mockResolvedValue(updatedEmployee);
      const employeeService = new EmployeeService();
      const result = await employeeService.updateEmployee(1, updateData);

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(mockRepository.merge).toHaveBeenCalledWith(
        existingEmployee,
        updateData
      );
      expect(mockRepository.save).toHaveBeenCalledWith(existingEmployee);
      expect(result).toEqual(updatedEmployee);
    });

    it("should throw error when employee to update not found", async () => {
      const updateData = { name: "Updated Name" };

      mockRepository.findOneBy.mockResolvedValue(null);
      const employeeService = new EmployeeService();
      await expect(
        employeeService.updateEmployee(999, updateData)
      ).rejects.toThrow("Employee not found");
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 999 });
      expect(mockRepository.merge).not.toHaveBeenCalled();
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it("should update employee with empty data", async () => {
      const existingEmployee = {
        id: 1,
        name: "Test",
        email_address: "test@example.com",
        position: "Developer",
      } as Employee;

      mockRepository.findOneBy.mockResolvedValue(existingEmployee);
      mockRepository.save.mockResolvedValue(existingEmployee);
      const employeeService = new EmployeeService();
      const result = await employeeService.updateEmployee(1, {});

      expect(mockRepository.merge).toHaveBeenCalledWith(existingEmployee, {});
      expect(result).toEqual(existingEmployee);
    });
  });

  describe("deleteEmployee", () => {
    it("should delete employee successfully", async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1, raw: {} });
      const employeeService = new EmployeeService();
      await employeeService.deleteEmployee(1);

      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });

    it("should throw error when employee to delete not found", async () => {
      mockRepository.delete.mockResolvedValue({ affected: 0, raw: {} });
      const employeeService = new EmployeeService();
      await expect(employeeService.deleteEmployee(999)).rejects.toThrow(
        "Employee not found"
      );
      expect(mockRepository.delete).toHaveBeenCalledWith(999);
    });

    it("should return void when deletion is successful", async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1, raw: {} });
      const employeeService = new EmployeeService();
      const result = await employeeService.deleteEmployee(1);

      expect(result).toBeUndefined();
    });
  });
});
