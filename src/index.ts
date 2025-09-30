import express from "express";
import { AppDataSource } from "./connector/dataSource";

const app = express();
const PORT = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.send("Exployee Backend Service is running");
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
