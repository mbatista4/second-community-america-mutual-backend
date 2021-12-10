const bankAccountRoutes = require('./BankAccountRoutes');
const memberRoutes = require('./MemberRoutes');
const tellerRoutes = require('./TellerRoutes');
const adminRoutes = require('./AdminRoutes');
const adminFunctions = require('./AdminfunctionsRoutes');
adminRoutes.use(adminFunctions)

module.exports = {
    bankAccountRoutes,
    memberRoutes,
    tellerRoutes,
    adminRoutes
}