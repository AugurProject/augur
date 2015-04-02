var constants = require('../constants');

var AccountActions = {
  updateAccount: function (account) {
    this.dispatch(constants.account.UPDATE_ACCOUNT, {account: account});
  }
};

module.exports = AccountActions;
