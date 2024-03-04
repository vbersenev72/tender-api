import tenderApiDb from "../../db/tenderApi.db.js";
import Sequelize from "sequelize";
import userModel from "./user.model.js";
import myTenderModel from "./myTender.model.js";
import tagModel from "./tag.model.js";
import tendersDataModel from "./tendersData.model.js";
import autoSearchModel from "./autoSearch.model.js";
import autoSearchResultModel from "./autoSearchResult.model.js";
import reportExcelModel from "./reportExcel.model.js";
import sendTenderSpecialistModel from "./sendTenderSpecialist.model.js";
import isReadTendersModel from "./isReadTenders.model.js";

const sequelize = new Sequelize(tenderApiDb.DB, tenderApiDb.USER, tenderApiDb.PASSWORD, {
    host: tenderApiDb.HOST,
    dialect: tenderApiDb.dialect,
    operatorsAliases: false,

    pool: {
      max: tenderApiDb.pool.max,
      min: tenderApiDb.pool.min,
      acquire: tenderApiDb.pool.acquire,
      idle: tenderApiDb.pool.idle
    }
  });

  sequelize.sync({ alter: true })
    .then(() => {
      console.log('Таблицы созданы');
      // Здесь можно продолжить выполнение кода вашего проекта
    })
    .catch((error) => {
      console.error('Ошибка при создании таблиц:', error);
    });

  const db = {};

  db.Sequelize = Sequelize;
  db.sequelize = sequelize;

  db.users = userModel(sequelize, Sequelize);
  db.myTenders = myTenderModel(sequelize, Sequelize)
  db.autoSearch = autoSearchModel(sequelize, Sequelize)
  db.tag = tagModel(sequelize, Sequelize)
  db.tendersData = tendersDataModel(sequelize, Sequelize)
  db.autoSearchResult = autoSearchResultModel(sequelize, Sequelize)
  db.reportExcel = reportExcelModel(sequelize, Sequelize)
  db.sendTenderSpecialist = sendTenderSpecialistModel(sequelize, Sequelize)
  db.isReadTenders = isReadTendersModel(sequelize, Sequelize)

  export default db