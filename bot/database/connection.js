const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");

dotenv.config();

const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  {
    dialect: "mysql",
    host: "db",
  }
);

module.exports = {
  start: async () => {
    try {
      await sequelize.authenticate();
      console.log("Database connection has been established successfully.");
    } catch (error) {
      console.error("Unable to connect to the database:", error);
    }
  },
};
