var constants = require('../constants');

var AccountActions = {
  updateAccount: function (account) {
    this.dispatch(constants.accounts.UPDATE_ACCOUNT, {account: account});
  }
};

module.exports = AccountActions;
