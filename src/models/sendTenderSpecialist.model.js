export default (sequelize, Sequelize) => {

    const sendToTenderSpecialist = sequelize.define("send_tender_specialist", {
        user_id: {
            type: Sequelize.INTEGER
        },
        reg_num: {
            type: Sequelize.TEXT
        },

    });

    return sendToTenderSpecialist;
};