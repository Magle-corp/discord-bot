import { DataTypes } from "sequelize";
import database from "../index.js";

const reflectiveAnalysis = database.define("reflective_analysis", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  createdBy: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  time: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  questionOne: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  questionTwo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  questionThree: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  endAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

await reflectiveAnalysis.sync({ alter: true });

export default reflectiveAnalysis;
