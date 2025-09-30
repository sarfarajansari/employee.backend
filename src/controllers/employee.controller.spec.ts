import { Request, Response } from "express";
import {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} from "./employee.controller";
import { employeeService } from "../services/employee.service";
import { Employee } from "../models/employee";

// Mock the employee service
jest.mock("../services/employee.service");

const mockEmployeeService = employeeService as jest.Mocked<typeof employeeService>;

describe("Employee Controller", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseObject: any;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Setup mock response object
    responseObject = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnValue(responseObject),
      send: jest.fn().mockReturnValue(responseObject),
    };
  });

  describe("createEmployee", () => {
    const validEmployeeData = {
      name: "John Doe",
      email_address: "john.doe@example.com",
      position: "Software Engineer",
    };

    const mockEmployee: Employee = {
      id: 1,
      name: "John Doe",
      email_address: "john.doe@example.com",
      position: "Software Engineer",
      created_at: new Date(),
      updated_at: new Date(),
    };

    it("should create an employee with valid data", async () => {
      mockRequest = {
        body: validEmployeeData,
      };

      mockEmployeeService.createEmployee.mockResolvedValue(mockEmployee);

      await createEmployee(mockRequest as Request, mockResponse as Response);

      expect(mockEmployeeService.createEmployee).toHaveBeenCalledWith(validEmployeeData);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(mockEmployee);
    });

    it("should return 400 error when name is missing", async () => {
      mockRequest = {
        body: {
          email_address: "john.doe@example.com",
          position: "Software Engineer",
        },
      };

      await createEmployee(mockRequest as Request, mockResponse as Response);

      expect(mockEmployeeService.createEmployee).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Invalid employee data",
      });
    });

    it("should return 400 error when email_address is missing", async () => {
      mockRequest = {
        body: {
          name: "John Doe",
          position: "Software Engineer",
        },
      };

      await createEmployee(mockRequest as Request, mockResponse as Response);

      expect(mockEmployeeService.createEmployee).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Invalid employee data",
      });
    });

    it("should return 400 error when position is missing", async () => {
      mockRequest = {
        body: {
          name: "John Doe",
          email_address: "john.doe@example.com",
        },
      };

      await createEmployee(mockRequest as Request, mockResponse as Response);

      expect(mockEmployeeService.createEmployee).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Invalid employee data",
      });
    });

    it("should return 400 error when name is not a string", async () => {
      mockRequest = {
        body: {
          name: 123,
          email_address: "john.doe@example.com",
          position: "Software Engineer",
        },
      };

      await createEmployee(mockRequest as Request, mockResponse as Response);

      expect(mockEmployeeService.createEmployee).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Invalid employee data",
      });
    });

    it("should return 400 error when email_address is not a string", async () => {
      mockRequest = {
        body: {
          name: "John Doe",
          email_address: 123,
          position: "Software Engineer",
        },
      };

      await createEmployee(mockRequest as Request, mockResponse as Response);

      expect(mockEmployeeService.createEmployee).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Invalid employee data",
      });
    });

    it("should return 400 error when position is not a string", async () => {
      mockRequest = {
        body: {
          name: "John Doe",
          email_address: "john.doe@example.com",
          position: 123,
        },
      };

      await createEmployee(mockRequest as Request, mockResponse as Response);

      expect(mockEmployeeService.createEmployee).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Invalid employee data",
      });
    });

    it("should return 400 error when request body is empty", async () => {
      mockRequest = {
        body: {},
      };

      await createEmployee(mockRequest as Request, mockResponse as Response);

      expect(mockEmployeeService.createEmployee).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Invalid employee data",
      });
    });

    it("should return 400 error when request body is null", async () => {
      mockRequest = {
        body: null,
      };

      await createEmployee(mockRequest as Request, mockResponse as Response);

      expect(mockEmployeeService.createEmployee).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Invalid employee data",
      });
    });
  });

  describe("getAllEmployees", () => {
    const mockEmployees: Employee[] = [
      {
        id: 1,
        name: "John Doe",
        email_address: "john.doe@example.com",
        position: "Software Engineer",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        name: "Jane Smith",
        email_address: "jane.smith@example.com",
        position: "Product Manager",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    it("should return all employees", async () => {
      mockRequest = {};
      mockEmployeeService.getAllEmployees.mockResolvedValue(mockEmployees);

      await getAllEmployees(mockRequest as Request, mockResponse as Response);

      expect(mockEmployeeService.getAllEmployees).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockEmployees);
    });

    it("should return empty array when no employees exist", async () => {
      mockRequest = {};
      mockEmployeeService.getAllEmployees.mockResolvedValue([]);

      await getAllEmployees(mockRequest as Request, mockResponse as Response);

      expect(mockEmployeeService.getAllEmployees).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith([]);
    });
  });

  describe("getEmployeeById", () => {
    const mockEmployee: Employee = {
      id: 1,
      name: "John Doe",
      email_address: "john.doe@example.com",
      position: "Software Engineer",
      created_at: new Date(),
      updated_at: new Date(),
    };

    it("should return employee by valid id", async () => {
      mockRequest = {
        params: { id: "1" },
      };

      mockEmployeeService.getEmployeeById.mockResolvedValue(mockEmployee);

      await getEmployeeById(mockRequest as Request, mockResponse as Response);

      expect(mockEmployeeService.getEmployeeById).toHaveBeenCalledWith(1);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockEmployee);
    });

    it("should return 404 when employee not found", async () => {
      mockRequest = {
        params: { id: "999" },
      };

      const error = new Error("Employee not found");
      mockEmployeeService.getEmployeeById.mockRejectedValue(error);

      await getEmployeeById(mockRequest as Request, mockResponse as Response);

      expect(mockEmployeeService.getEmployeeById).toHaveBeenCalledWith(999);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Employee not found",
      });
    });

    it("should handle string id parameter correctly", async () => {
      mockRequest = {
        params: { id: "123" },
      };

      mockEmployeeService.getEmployeeById.mockResolvedValue(mockEmployee);

      await getEmployeeById(mockRequest as Request, mockResponse as Response);

      expect(mockEmployeeService.getEmployeeById).toHaveBeenCalledWith(123);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockEmployee);
    });

    it("should handle invalid id parameter (NaN)", async () => {
      mockRequest = {
        params: { id: "invalid" },
      };

      const error = new Error("Employee not found");
      mockEmployeeService.getEmployeeById.mockRejectedValue(error);

      await getEmployeeById(mockRequest as Request, mockResponse as Response);

      expect(mockEmployeeService.getEmployeeById).toHaveBeenCalledWith(NaN);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Employee not found",
      });
    });
  });

  describe("updateEmployee", () => {
    const validEmployeeData = {
      name: "John Doe Updated",
      email_address: "john.updated@example.com",
      position: "Senior Software Engineer",
    };

    const mockUpdatedEmployee: Employee = {
      id: 1,
      name: "John Doe Updated",
      email_address: "john.updated@example.com",
      position: "Senior Software Engineer",
      created_at: new Date(),
      updated_at: new Date(),
    };

    it("should update employee with valid data", async () => {
      mockRequest = {
        params: { id: "1" },
        body: validEmployeeData,
      };

      mockEmployeeService.updateEmployee.mockResolvedValue(mockUpdatedEmployee);

      await updateEmployee(mockRequest as Request, mockResponse as Response);

      expect(mockEmployeeService.updateEmployee).toHaveBeenCalledWith(1, validEmployeeData);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockUpdatedEmployee);
    });

    it("should return 400 error when employee data is invalid", async () => {
      mockRequest = {
        params: { id: "1" },
        body: {
          name: "John Doe",
          email_address: "john.doe@example.com",
          // missing position
        },
      };

      await updateEmployee(mockRequest as Request, mockResponse as Response);

      expect(mockEmployeeService.updateEmployee).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Invalid employee data",
      });
    });

    it("should return 404 when employee not found", async () => {
      mockRequest = {
        params: { id: "999" },
        body: validEmployeeData,
      };

      const error = new Error("Employee not found");
      mockEmployeeService.updateEmployee.mockRejectedValue(error);

      await updateEmployee(mockRequest as Request, mockResponse as Response);

      expect(mockEmployeeService.updateEmployee).toHaveBeenCalledWith(999, validEmployeeData);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Employee not found",
      });
    });

    it("should return 400 error when name is not a string", async () => {
      mockRequest = {
        params: { id: "1" },
        body: {
          name: 123,
          email_address: "john.doe@example.com",
          position: "Software Engineer",
        },
      };

      await updateEmployee(mockRequest as Request, mockResponse as Response);

      expect(mockEmployeeService.updateEmployee).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Invalid employee data",
      });
    });

    it("should return 400 error when email_address is not a string", async () => {
      mockRequest = {
        params: { id: "1" },
        body: {
          name: "John Doe",
          email_address: 123,
          position: "Software Engineer",
        },
      };

      await updateEmployee(mockRequest as Request, mockResponse as Response);

      expect(mockEmployeeService.updateEmployee).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Invalid employee data",
      });
    });

    it("should return 400 error when position is not a string", async () => {
      mockRequest = {
        params: { id: "1" },
        body: {
          name: "John Doe",
          email_address: "john.doe@example.com",
          position: 123,
        },
      };

      await updateEmployee(mockRequest as Request, mockResponse as Response);

      expect(mockEmployeeService.updateEmployee).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Invalid employee data",
      });
    });

    it("should handle invalid id parameter (NaN)", async () => {
      mockRequest = {
        params: { id: "invalid" },
        body: validEmployeeData,
      };

      const error = new Error("Employee not found");
      mockEmployeeService.updateEmployee.mockRejectedValue(error);

      await updateEmployee(mockRequest as Request, mockResponse as Response);

      expect(mockEmployeeService.updateEmployee).toHaveBeenCalledWith(NaN, validEmployeeData);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Employee not found",
      });
    });
  });

  describe("deleteEmployee", () => {
    it("should delete employee successfully", async () => {
      mockRequest = {
        params: { id: "1" },
      };

      mockEmployeeService.deleteEmployee.mockResolvedValue();

      await deleteEmployee(mockRequest as Request, mockResponse as Response);

      expect(mockEmployeeService.deleteEmployee).toHaveBeenCalledWith(1);
      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.send).toHaveBeenCalled();
    });

    it("should return 404 when employee not found", async () => {
      mockRequest = {
        params: { id: "999" },
      };

      const error = new Error("Employee not found");
      mockEmployeeService.deleteEmployee.mockRejectedValue(error);

      await deleteEmployee(mockRequest as Request, mockResponse as Response);

      expect(mockEmployeeService.deleteEmployee).toHaveBeenCalledWith(999);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Employee not found",
      });
    });

    it("should handle string id parameter correctly", async () => {
      mockRequest = {
        params: { id: "123" },
      };

      mockEmployeeService.deleteEmployee.mockResolvedValue();

      await deleteEmployee(mockRequest as Request, mockResponse as Response);

      expect(mockEmployeeService.deleteEmployee).toHaveBeenCalledWith(123);
      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.send).toHaveBeenCalled();
    });

    it("should handle invalid id parameter (NaN)", async () => {
      mockRequest = {
        params: { id: "invalid" },
      };

      const error = new Error("Employee not found");
      mockEmployeeService.deleteEmployee.mockRejectedValue(error);

      await deleteEmployee(mockRequest as Request, mockResponse as Response);

      expect(mockEmployeeService.deleteEmployee).toHaveBeenCalledWith(NaN);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Employee not found",
      });
    });
  });
});
