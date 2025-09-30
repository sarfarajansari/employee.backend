import request from 'supertest';
import express from 'express';
import { employeeRouter } from './employee.router';
import * as employeeController from '../controllers/employee.controller';

// Mock the employee controller functions
jest.mock('../controllers/employee.controller', () => ({
  createEmployee: jest.fn(),
  getAllEmployees: jest.fn(),
  getEmployeeById: jest.fn(),
  updateEmployee: jest.fn(),
  deleteEmployee: jest.fn(),
}));

describe('Employee Router', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/employees', employeeRouter);
    jest.clearAllMocks();
  });

  describe('POST /', () => {
    it('should call createEmployee controller', async () => {
      const mockEmployee = {
        id: 1,
        name: 'John Doe',
        email_address: 'john@example.com',
        position: 'Developer',
        created_at: '2025-09-30T11:17:08.108Z',
        updated_at: '2025-09-30T11:17:08.108Z',
      };

      (employeeController.createEmployee as jest.Mock).mockImplementation((req, res) => {
        res.status(201).json(mockEmployee);
      });

      const employeeData = {
        name: 'John Doe',
        email_address: 'john@example.com',
        position: 'Developer',
      };

      const response = await request(app)
        .post('/employees')
        .send(employeeData)
        .expect(201);

      expect(employeeController.createEmployee).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual(mockEmployee);
    });

    it('should handle validation errors from createEmployee controller', async () => {
      (employeeController.createEmployee as jest.Mock).mockImplementation((req, res) => {
        res.status(400).json({ error: 'Invalid employee data' });
      });

      const invalidData = {
        name: 'John Doe',
        // missing required fields
      };

      const response = await request(app)
        .post('/employees')
        .send(invalidData)
        .expect(400);

      expect(employeeController.createEmployee).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual({ error: 'Invalid employee data' });
    });
  });

  describe('GET /', () => {
    it('should call getAllEmployees controller and return all employees', async () => {
      const mockEmployees = [
        {
          id: 1,
          name: 'John Doe',
          email_address: 'john@example.com',
          position: 'Developer',
          created_at: '2025-09-30T11:17:08.194Z',
          updated_at: '2025-09-30T11:17:08.194Z',
        },
        {
          id: 2,
          name: 'Jane Smith',
          email_address: 'jane@example.com',
          position: 'Designer',
          created_at: '2025-09-30T11:17:08.194Z',
          updated_at: '2025-09-30T11:17:08.194Z',
        },
      ];

      (employeeController.getAllEmployees as jest.Mock).mockImplementation((req, res) => {
        res.status(200).json(mockEmployees);
      });

      const response = await request(app)
        .get('/employees')
        .expect(200);

      expect(employeeController.getAllEmployees).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual(mockEmployees);
    });

    it('should return empty array when no employees exist', async () => {
      (employeeController.getAllEmployees as jest.Mock).mockImplementation((req, res) => {
        res.status(200).json([]);
      });

      const response = await request(app)
        .get('/employees')
        .expect(200);

      expect(employeeController.getAllEmployees).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual([]);
    });
  });

  describe('GET /:id', () => {
    it('should call getEmployeeById controller with correct id', async () => {
      const mockEmployee = {
        id: 1,
        name: 'John Doe',
        email_address: 'john@example.com',
        position: 'Developer',
        created_at: '2025-09-30T11:17:08.210Z',
        updated_at: '2025-09-30T11:17:08.210Z',
      };

      (employeeController.getEmployeeById as jest.Mock).mockImplementation((req, res) => {
        res.status(200).json(mockEmployee);
      });

      const response = await request(app)
        .get('/employees/1')
        .expect(200);

      expect(employeeController.getEmployeeById).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual(mockEmployee);
    });

    it('should handle not found error from getEmployeeById controller', async () => {
      (employeeController.getEmployeeById as jest.Mock).mockImplementation((req, res) => {
        res.status(404).json({ error: 'Employee not found' });
      });

      const response = await request(app)
        .get('/employees/999')
        .expect(404);

      expect(employeeController.getEmployeeById).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual({ error: 'Employee not found' });
    });

    it('should handle invalid id parameter', async () => {
      (employeeController.getEmployeeById as jest.Mock).mockImplementation((req, res) => {
        res.status(404).json({ error: 'Employee not found' });
      });

      const response = await request(app)
        .get('/employees/invalid')
        .expect(404);

      expect(employeeController.getEmployeeById).toHaveBeenCalledTimes(1);
    });
  });

  describe('PUT /:id', () => {
    it('should call updateEmployee controller with correct id and data', async () => {
      const mockUpdatedEmployee = {
        id: 1,
        name: 'John Doe Updated',
        email_address: 'john.updated@example.com',
        position: 'Senior Developer',
        created_at: '2025-09-30T11:17:08.232Z',
        updated_at: '2025-09-30T11:17:08.232Z',
      };

      (employeeController.updateEmployee as jest.Mock).mockImplementation((req, res) => {
        res.status(200).json(mockUpdatedEmployee);
      });

      const updateData = {
        name: 'John Doe Updated',
        email_address: 'john.updated@example.com',
        position: 'Senior Developer',
      };

      const response = await request(app)
        .put('/employees/1')
        .send(updateData)
        .expect(200);

      expect(employeeController.updateEmployee).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual(mockUpdatedEmployee);
    });

    it('should handle validation errors from updateEmployee controller', async () => {
      (employeeController.updateEmployee as jest.Mock).mockImplementation((req, res) => {
        res.status(400).json({ error: 'Invalid employee data' });
      });

      const invalidUpdateData = {
        name: 123, // invalid type
        email_address: 'john@example.com',
        position: 'Developer',
      };

      const response = await request(app)
        .put('/employees/1')
        .send(invalidUpdateData)
        .expect(400);

      expect(employeeController.updateEmployee).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual({ error: 'Invalid employee data' });
    });

    it('should handle not found error from updateEmployee controller', async () => {
      (employeeController.updateEmployee as jest.Mock).mockImplementation((req, res) => {
        res.status(404).json({ error: 'Employee not found' });
      });

      const updateData = {
        name: 'John Doe',
        email_address: 'john@example.com',
        position: 'Developer',
      };

      const response = await request(app)
        .put('/employees/999')
        .send(updateData)
        .expect(404);

      expect(employeeController.updateEmployee).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual({ error: 'Employee not found' });
    });
  });

  describe('DELETE /:id', () => {
    it('should call deleteEmployee controller with correct id', async () => {
      (employeeController.deleteEmployee as jest.Mock).mockImplementation((req, res) => {
        res.status(204).send();
      });

      await request(app)
        .delete('/employees/1')
        .expect(204);

      expect(employeeController.deleteEmployee).toHaveBeenCalledTimes(1);
    });

    it('should handle not found error from deleteEmployee controller', async () => {
      (employeeController.deleteEmployee as jest.Mock).mockImplementation((req, res) => {
        res.status(404).json({ error: 'Employee not found' });
      });

      const response = await request(app)
        .delete('/employees/999')
        .expect(404);

      expect(employeeController.deleteEmployee).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual({ error: 'Employee not found' });
    });

    it('should handle invalid id parameter for delete', async () => {
      (employeeController.deleteEmployee as jest.Mock).mockImplementation((req, res) => {
        res.status(404).json({ error: 'Employee not found' });
      });

      const response = await request(app)
        .delete('/employees/invalid')
        .expect(404);

      expect(employeeController.deleteEmployee).toHaveBeenCalledTimes(1);
    });
  });

  describe('Route parameter validation', () => {
    it('should pass correct parameters to controller functions', async () => {
      const mockEmployee = {
        id: 42,
        name: 'Test Employee',
        email_address: 'test@example.com',
        position: 'Tester',
        created_at: '2025-09-30T11:17:08.300Z',
        updated_at: '2025-09-30T11:17:08.300Z',
      };

      (employeeController.getEmployeeById as jest.Mock).mockImplementation((req, res) => {
        // Verify that the id parameter is correctly passed
        expect(req.params.id).toBe('42');
        res.status(200).json(mockEmployee);
      });

      await request(app)
        .get('/employees/42')
        .expect(200);

      expect(employeeController.getEmployeeById).toHaveBeenCalledTimes(1);
    });
  });

  describe('HTTP Methods', () => {
    it('should only allow defined HTTP methods', async () => {
      // Test that PATCH is not allowed (should return 404 or 405)
      await request(app)
        .patch('/employees/1')
        .send({ name: 'Test' })
        .expect(404);
    });

    it('should handle HEAD requests for GET endpoints', async () => {
      (employeeController.getAllEmployees as jest.Mock).mockImplementation((req, res) => {
        res.status(200).json([]);
      });

      await request(app)
        .head('/employees')
        .expect(200);
    });
  });
});
