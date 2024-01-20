export default (sequelize, Sequelize) => {

    const tendersData = sequelize.define("tenders_data", {
        user_id: {
            type: Sequelize.INTEGER
        },
        reg_num: {
            type: Sequelize.TEXT
        },
        tag_id: {
            type: Sequelize.INTEGER
        }

    });

    return tendersData;
};