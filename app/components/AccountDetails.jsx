var React = require('react');
var Fluxxor = require("fluxxor");
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var ReactBootstrap = require('react-bootstrap');
var Button = ReactBootstrap.Button;
var Modal = ReactBootstrap.Modal;
var ModalTrigger = ReactBootstrap.ModalTrigger;


var AccountDetailsModal = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin('asset')],

  getInitialState: function () {
    return {
    };
  },

  getStateFromFlux: function () {
    var flux = this.getFlux();

    return {
      primaryAccount: flux.store('network').getAccount(),
      allAccounts:flux.store('network').getState().accounts,
      cashBalance: flux.store('asset').getState().balance,
    }
  },

  render: function () {
    return (
      <Modal {...this.props} id='account-modal'>
        <div className="modal-body clearfix">
            <h4>Accounts</h4>
            <p className="user address primary">{ this.state.primaryAccount }</p>
        </div>
      </Modal>
    );
  }
});

var AccountDetailsTrigger = React.createClass({
  mixins: [FluxMixin],

  render: function () {
    return (
      <ModalTrigger modal={<AccountDetailsModal {...this.props} />}>
        <a href='#'>Account</a>
      </ModalTrigger>
    );
  }
});

module.exports = {
  AccountDetailsModal: AccountDetailsModal,
  AccountDetailsTrigger: AccountDetailsTrigger
};
