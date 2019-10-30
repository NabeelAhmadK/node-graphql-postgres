const dbConnection = {
  client: "pg",
  connection: {
    user: "postgres",
    password: "admin",
    database: "node_api",
    host: "localhost",
    port: 5432,
    dialect: "postgres",
    define: {
      timestamps: false
    }
  }
};

module.exports = dbConnection;
