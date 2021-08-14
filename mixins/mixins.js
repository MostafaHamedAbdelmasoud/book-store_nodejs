const moment = require("moment");

getCreatedAt = function (model) {
    return moment(model.createdAt).format("DD-MM-YYYY h:mm:ss");
};



module.exports = {getCreatedAt}