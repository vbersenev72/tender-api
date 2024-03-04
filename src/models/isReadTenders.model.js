export default (sequelize, Sequelize) => {

    const isReadTenders = sequelize.define("is_read_tender", {
        user_id: {
            type: Sequelize.INTEGER
        },
        reg_num: {
            type: Sequelize.TEXT
        },
    });

    return isReadTenders;
};