export default (sequelize, Sequelize) => {

    const reportExcel = sequelize.define("report_excel", {
        user_id: {
            type: Sequelize.INTEGER
        },
        link: {
            type: Sequelize.TEXT
        },
   

    });

    return reportExcel;
};