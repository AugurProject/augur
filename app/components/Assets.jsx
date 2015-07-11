var _ = require('lodash');
var React = require('react');
var Fluxxor = require("fluxxor");
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var utilities = require('../libs/utilities');

var ReactBootstrap = require('react-bootstrap');
var Button = ReactBootstrap.Button;
var ButtonGroup = ReactBootstrap.ButtonGroup;
var OverlayTrigger = ReactBootstrap.OverlayTrigger;
var Popover = ReactBootstrap.Popover;

var SendCashModal = require('./SendModal').SendCashModal;
var SendRepModal = require('./SendModal').SendRepModal;
var SendEtherModal = require('./SendModal').SendEtherModal;

var Assets = React.createClass({

  mixins: [FluxMixin],

  getInitialState: function () {
    return {
      repFaucetDisabled: false,
      cashFaucetDisabled: false,
      sendCashModalOpen: false,
      sendRepModalOpen: false,
      sendEtherModalOpen: false
    };
  },

  onCashFaucet: function(event) {

    if (!this.state.cashFaucetDisabled) {

      if (this.state.asset.ether.toNumber() < constants.MIN_ETHER_WARNING) {
        utilities.warn('not enough ether'); 
      }

      this.setState({cashFaucetDisabled: true});
      this.state.ethereumClient.cashFaucet(function(txHash) {
        var flux = this.getFlux();
        flux.actions.transaction.addTransaction({
          hash: txHash, 
          type: constants.transaction.CASH_FAUCET_TYPE, 
          description: 'requesting cash'
        });
      }.bind(this));
    }
  },

  onRepFaucet: function(event) {

    if (!this.state.repFaucetDisabled) {

      if (this.state.asset.ether.toNumber() < constants.MIN_ETHER_WARNING) {
        utilities.warn('not enough ether');
      }

      this.setState({repFaucetDisabled: true});
      this.state.ethereumClient.repFaucet(null, function(txHash) {
        var flux = this.getFlux();
        flux.actions.transaction.addTransaction({
          hash: txHash, 
          type: constants.transaction.REP_FAUCET_TYPE, 
          description: 'requesting reputation'
        });
      }.bind(this));
    } 
  },

  toggleSendCashModal: function(event) {

    this.setState({sendCashModalOpen: !this.state.sendCashModalOpen});
  },

  toggleSendRepModal: function(event) {

     this.setState({sendRepModalOpen: !this.state.sendRepModalOpen});
  },

  toggleSendEtherModal: function(event) {

     this.setState({sendEtherModalOpen: !this.state.sendEtherModalOpen});
  },

  render: function () {

    var cashBalance = this.props.asset.cash ? this.props.asset.cash.toFixed(4) : '-';
    var repBalance = this.props.asset.reputation ? this.props.asset.reputation : '-';

    return (
      <div className="panel panel-info assets">
        <div className="panel-heading">Balances</div>
        <div className="panel-body">
          <div className='cash-balance'>
            <span className="unit">cash</span><span className='pull-right'>{ cashBalance }</span>
            <ButtonGroup  className="hide">
              <Button bsSize='xsmall' bsStyle='primary' onClick={ this.toggleSendCashModal }>Send</Button>
              <Button disabled={ this.state.cashFaucetDisabled } bsSize='xsmall' bsStyle='default' onClick={ this.onCashFaucet }>Faucet<i className='fa fa-tint'></i></Button>
            </ButtonGroup>
          </div>

          <div className='rep-balance'>
            <span className="unit">reputation</span><span className='pull-right'>{ repBalance }</span>
            <ButtonGroup className="hide">
              <Button bsSize='xsmall' bsStyle='primary' onClick={ this.toggleSendRepModal }>Send</Button>
              <Button disabled={ this.state.repFaucetDisabled } bsSize='xsmall' bsStyle='default' onClick={ this.onRepFaucet }>Faucet<i className='fa fa-tint'></i></Button>
            </ButtonGroup>
          </div>

          <div className='ether-balance'>
            <span className="unit">{ utilities.formatEther(this.props.asset.ether).unit }</span><span className='pull-right'>{ utilities.formatEther(this.props.asset.ether).value }</span>
            <Button  className="hide" bsSize='xsmall' bsStyle='primary' onClick={ this.toggleSendEtherModal }>Send</Button>
          </div>

          <SendEtherModal show={ this.state.sendEtherModalOpen } onHide={ this.toggleSendEtherModal } />
          <SendRepModal show={ this.state.sendRepModalOpen } onHide={ this.toggleSendRepModal } />
          <SendCashModal show={ this.state.sendCashModalOpen } onHide={ this.toggleSendCashModal } />
        </div>
      </div>
    );
  }
});

module.exports = Assets;
