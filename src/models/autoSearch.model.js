export default (sequelize, Sequelize) => {

    const autoSearch = sequelize.define("auto_search", {
        user_id: {
            type: Sequelize.INTEGER
        },
        name: {
            type: Sequelize.TEXT
        },
        tags: {
            type: Sequelize.TEXT
        },
        stopTags: {
            type: Sequelize.TEXT
        },
        publicDateFrom: {
            type: Sequelize.TEXT
        },
        publicDateTo: {
            type: Sequelize.TEXT
        },
        startDateFrom: {
            type: Sequelize.TEXT
        },
        startDateTo: {
            type: Sequelize.TEXT
        },
        endDateFrom: {
            type: Sequelize.TEXT
        },
        endDateTo: {
            type: Sequelize.TEXT
        },
        fz: {
            type: Sequelize.TEXT
        },
        region: {
            type: Sequelize.TEXT
        },
        tenderNum: {
            type: Sequelize.TEXT
        },
        customerName: {
            type: Sequelize.TEXT
        },
        stopCustomerName: {
            type: Sequelize.TEXT
        },
        inn: {
            type: Sequelize.TEXT
        },
        priceFrom: {
            type: Sequelize.TEXT
        },
        priceTo: {
            type: Sequelize.TEXT
        },
        enablePrice: {
            type: Sequelize.TEXT
        },
        source: {
            type: Sequelize.TEXT
        },
        enableSource: {
            type: Sequelize.TEXT
        },
        okpd2: {
            type: Sequelize.TEXT
        },
        last_search: {
            type: Sequelize.TEXT
        },
        push_user: {
            type: Sequelize.TEXT
        }
        
    });

    return autoSearch;
};