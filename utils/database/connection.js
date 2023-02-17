const { promisify } = require("util");
const { glob } = require("glob");
const { Sequelize } = require("sequelize");

const pGlob = promisify(glob);

const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  {
    dialect: "mysql",
  }
);

module.exports = {
  start: async () => {
    try {
      await sequelize.authenticate();
      console.log("Database connection has been established successfully.");

      // const modelFiles = (
      //   await pGlob(process.cwd() + "/utils/database/models/*.js")
      // ).map((filePath) => filePath);
      //
      // modelFiles.map((modelFile) => {
      //   const model = require(modelFile);
      //
      //   try {
      //     sequelize.define(model.name, { ...model.attributes });
      //   } catch (error) {
      //     console.error("PROUT ERROR");
      //   }
      // });
    } catch (error) {
      console.error("Unable to connect to the database:", error);
    }
  },
};
