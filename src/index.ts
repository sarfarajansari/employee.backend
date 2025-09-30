import express from "express";
import { AppDataSource } from "./connector/dataSource";
import { employeeRouter } from "./routes/employee.router";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use("/api/employees", employeeRouter);
app.get("/", (req, res) => {
  res.send("Employee Backend Service is running");
});

AppDataSource.initialize()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error during Data Source initialization:", error);
  });
