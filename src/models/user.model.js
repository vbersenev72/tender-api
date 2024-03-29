export default (sequelize, Sequelize) => {

    const Users = sequelize.define("users", {
        name: {
            type: Sequelize.TEXT
        },
        phone: {
            type: Sequelize.TEXT
        },
        email: {
            type: Sequelize.TEXT
        },
        inn: {
            type: Sequelize.TEXT
        },
        password: {
            type: Sequelize.TEXT
        },
        tariff: {
            type: Sequelize.TEXT, // test/std/vip
            defaultValue: 'test',
        },
        role: {
            type: Sequelize.TEXT,
            defaultValue: 'user',
        },
        balance: {
            type: Sequelize.TEXT,
            defaultValue: "0"
        },
        endtime: {
            type: Sequelize.TEXT,
        },
        register_date: {
            type: Sequelize.TEXT
        },
        company_name: {
            type: Sequelize.TEXT
        },
        company_inn: {
            type: Sequelize.TEXT
        },
        company_address: {
            type: Sequelize.TEXT
        },
        post_address: {
            type: Sequelize.TEXT
        },
        email_notif: {
            type: Sequelize.BOOLEAN
        },
        push_notif: {
            type: Sequelize.BOOLEAN
        },
        /// Еще чета добавить

    });

    return Users;
};