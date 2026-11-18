
require("dotenv").config();

const { createDatabase } = require("./config/database");

createDatabase();
