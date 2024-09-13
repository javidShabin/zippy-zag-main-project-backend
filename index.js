require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const port = 5000; // Port

app.use(cors()); // The cors middleware
app.use(express.json());
app.use(cookieParser()); // Cookie parser 

// Create the server using port number
app.listen(port, () => {
  console.log(`The server running in port ${port}`);
});
