export default (sequelize, Sequelize) => {

    const TagModel = sequelize.define("tags", {
        user_id: {
            type: Sequelize.INTEGER
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