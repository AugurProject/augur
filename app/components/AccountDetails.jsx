var React = require('react');
var Fluxxor = require("fluxxor");
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var ReactBootstrap = require('react-bootstrap');
var Button = ReactBootstrap.Button;
var Modal = ReactBootstrap.Modal;
var ModalTrigger = ReactBootstrap.ModalTrigger;

var SendCashTrigger = require('./SendCash').SendCashTrigger;
var SendRepTrigger = require('./SendRep').SendRepTrigger;
var SendGasTrigger = require('./SendGas').SendGasTrigger;

var AccountDetailsModal = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin('asset')],

  getInitialState: function () {
    return {
    };
  },

  getStateFromFlux: function () {
    var flux = this.getFlux();
    var assetState = flux.store('asset').getState();

    return {
      primaryAccount: flux.store('network').getAccount(),
      allAccounts:flux.store('network').getState().accounts,
      cashBalance: assetState.balance,
      repBalance: assetState.reputation,
      gasBalance: assetState.gas
    }
  },

  onCashFaucet: function(event) {

  },

  onRepFaucet: function(event) {

  },

  render: function () {
    return (
      <Modal {...this.props} id='account-modal'>
        <div className="modal-body clearfix">
            <h4>Account</h4>
            <p><b>Address</b><span className='detail'>{ this.state.primaryAccount }</span></p>
            <p><b>Cash</b><span className='detail'>{ this.state.cashBalance }<SendCashTrigger text='send' /></span></p>
            <p><b>Reputation</b><span className='detail'>{ this.state.repBalance }<SendRepTrigger text='send' /></span></p>
            <p><b>Gas</b><span className='detail'>{ this.state.gasBalance }<SendGasTrigger text='send' /></span></p>
        </div>
        <div className="modal-footer clearfix">
          <Button bsSize='x-small' bsStyle='default' onClick={ this.onCashFaucet }>Cash Faucet<i className='fa fa-tint'></i></Button>
          <Button bsSize='x-small' bsStyle='default' onClick={ this.onRepFaucet }>Rep Faucet<i className='fa fa-tint'></i></Button>
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
