require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { dbConnection } = require("./config/dbConnection");
const { apiRouter } = require("./routes");
const port = 5000; // Port

app.use(
  cors({
    credentials: true,
    origin: "https://zippy-zag-main-project-frontend.vercel.app",
  })
); // The cors middleware
app.use(express.json());
app.use(cookieParser()); // Cookie parser

dbConnection(); // Connect the database

app.use("/api", apiRouter); // The api router

// Create the server using port number
app.listen(port, () => {
  console.log(`The server running in port ${port}`);
});
