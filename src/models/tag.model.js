export default (sequelize, Sequelize) => {

    const TagModel = sequelize.define("tags", {
        user_id: {
            type: Sequelize.INTEGER
        },
        reg_num: {
            type: Sequelize.TEXT
        },
        tag_name: {
            type: Sequelize.TEXT
        },
        tag_color: {
            type: Sequelize.TEXT
        }
        
    });

    return TagModel;
};