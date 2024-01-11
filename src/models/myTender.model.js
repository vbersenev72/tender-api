export default (sequelize, Sequelize) => {

    const MyTenders = sequelize.define("my_tenders", {
        user_id: {
            type: Sequelize.INTEGER
        },
        reg_num: {
            type: Sequelize.TEXT
        },
        
    });

    return MyTenders;
};