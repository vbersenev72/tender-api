export default (sequelize, Sequelize) => {

    const autoSearch = sequelize.define("auto_search", {
        user_id: {
            type: Sequelize.INTEGER
        },
        name: {
            type: Sequelize.TEXT,
            defaultValue: ''
        },
        tags: {
            type: Sequelize.TEXT,
            defaultValue: ''
        },
        stopTags: {
            type: Sequelize.TEXT,
            defaultValue: ''
        },
        publicDateFrom: {
            type: Sequelize.TEXT,
            defaultValue: ''
        },
        publicDateTo: {
            type: Sequelize.TEXT,
            defaultValue: ''
        },
        startDateFrom: {
            type: Sequelize.TEXT,
            defaultValue: ''
        },
        startDateTo: {
            type: Sequelize.TEXT,
            defaultValue: ''
        },
        endDateFrom: {
            type: Sequelize.TEXT,
            defaultValue: ''
        },
        endDateTo: {
            type: Sequelize.TEXT,
            defaultValue: ''
        },
        fz: {
            type: Sequelize.TEXT,
            defaultValue: ''
        },
        region: {
            type: Sequelize.TEXT,
            defaultValue: ''
        },
        tenderNum: {
            type: Sequelize.TEXT,
            defaultValue: ''
        },
        customerName: {
            type: Sequelize.TEXT,
            defaultValue: ''
        },
        stopCustomerName: {
            type: Sequelize.TEXT,
            defaultValue: 'false'
        },
        inn: {
            type: Sequelize.TEXT,
            defaultValue: ''
        },
        priceFrom: {
            type: Sequelize.TEXT,
            defaultValue: ''
        },
        priceTo: {
            type: Sequelize.TEXT,
            defaultValue: ''
        },
        enablePrice: {
            type: Sequelize.TEXT,
            defaultValue: ''
        },
        source: {
            type: Sequelize.TEXT,
            defaultValue: ''
        },
        enableSource: {
            type: Sequelize.TEXT,
            defaultValue: ''
        },
        okpd2: {
            type: Sequelize.TEXT,
            defaultValue: ''
        },
        last_search: {
            type: Sequelize.TEXT,
            defaultValue: ''
        },
        methodDeterminingSupplier: {
            type: Sequelize.TEXT,
            defaultValue: ''
        },
        purchaseStage: {
            type: Sequelize.TEXT,
            defaultValue: ''
        },
        push_user: {
            type: Sequelize.TEXT,
            defaultValue: ''
        },


    });

    return autoSearch;
};