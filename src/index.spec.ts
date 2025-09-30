import request from "supertest";

// Mock the dependencies to avoid actual database connections
jest.mock("./connector/dataSource", () => ({
  AppDataSource: {
    initialize: jest.fn().mockResolvedValue(undefined),
    getRepository: jest.fn().mockReturnValue({
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
      create: jest.fn(),
    }),
  },
}));

// Create a test version of the app
describe("Express App", () => {
  it("should respond to GET /", async () => {
    // Import after mocking
    const { app } = await import("./index");

    const response = await request(app).get("/").expect(200);

    expect(response.text).toBe("Employee Backend Service is running");
  });

  it("should handle database initialization error", async () => {
    // Mock console.error to capture the error log
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    // Clear the module cache to re-import with new mock
    jest.resetModules();

    // Re-mock AppDataSource to reject
    jest.doMock("./connector/dataSource", () => ({
      AppDataSource: {
        initialize: jest
          .fn()
          .mockRejectedValue(new Error("Database connection failed")),
        getRepository: jest.fn().mockReturnValue({
          find: jest.fn(),
          findOne: jest.fn(),
          save: jest.fn(),
          remove: jest.fn(),
          create: jest.fn(),
        }),
      },
    }));

    // Import the module again
    await import("./index");

    // Wait for the promise to be rejected
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Verify that console.error was called with the expected message
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error during Data Source initialization:",
      expect.any(Error)
    );

    // Restore console.error
    consoleSpy.mockRestore();
  });
});
