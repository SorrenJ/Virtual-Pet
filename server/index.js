const express = require("express");
const app = express();
const cors = require("cors");
require('dotenv').config();
const pool = require('./db/db'); // Import the pool from db/db.js

//middleware
app.use(cors());

app.listen(5000, () => {
    console.log("server started on port 5000");
});
