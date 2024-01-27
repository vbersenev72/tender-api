export default (sequelize, Sequelize) => {

    const MyTenders = sequelize.define("auto_search_result", {
        user_id: {
            type: Sequelize.INTEGER
        },
        autosearch_id: {
            type: Sequelize.INTEGER
        },
        reg_num: {
            type: Sequelize.TEXT
        },
        isRead: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },


    });

    return MyTenders;
};