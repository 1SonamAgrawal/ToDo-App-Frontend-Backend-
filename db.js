const knex = require("knex");

const db = knex({
  client: "pg",
  connection: {
    host : "127.0.0.1",
    user : "postgres",
    port : 5432,
    password : "Sonam@123",
    database : "To_Do"
  }
});

module.exports = db;