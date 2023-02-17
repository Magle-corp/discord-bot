import { DataTypes } from "sequelize";
import database from "../index.js";

const user = database.define("user", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  discord_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  discord_discriminator: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

await user.sync({ alter: true });

export default user;
