var _ = require('lodash');
var React = require('react');
var Fluxxor = require("fluxxor");
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var utilities = require('../libs/utilities');
var constants = require('../libs/constants');

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

  onCashFaucet: function (event) {
    if (!this.state.cashFaucetDisabled) {
      var self = this;
      if (this.props.asset.ether.toNumber() < constants.MIN_ETHER_WARNING) {
        utilities.warn('not enough ether'); 
      }
      augur.cashFaucet({
        onSent: function (result) {
          if (result && !result.error) {
            self.getFlux().actions.transaction.addTransaction({
              hash: result.txHash, 
              type: constants.transaction.CASH_FAUCET_TYPE, 
              description: 'requesting cash'
            });
          } else {
            console.error("cash faucet failed:", result);
          }
        },
        onSuccess: function (result) {
          console.log("cash faucet success:", result.txHash);
          flux.actions.asset.updateAssets();
        },
        onFailed: function (err) {
          console.error("cash faucet failed:", err);
        }
      });
    }
  },

  onRepFaucet: function (event) {
    if (!this.state.repFaucetDisabled) {
      if (this.props.asset.ether.toNumber() < constants.MIN_ETHER_WARNING) {
        utilities.warn('not enough ether');
      }
      var flux = this.getFlux();
      augur.reputationFaucet({
        branch: flux.store('branch').getCurrentBranch().id, 
        onSent: function (result) {
          if (result && !result.error) {
            flux.actions.transaction.addTransaction({
              hash: result.txHash,
              type: constants.transaction.REP_FAUCET_TYPE, 
              description: 'requesting reputation'
            });
          } else {
            console.error("reputation faucet failed:", result);
          }
        },
        onSuccess: function (result) {
          console.log("reputation faucet success:", result.txHash);
          flux.actions.asset.updateAssets();
        },
        onFailed: function (err) {
          console.error("reputation faucet failed:", err);
        }
      });
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

    if (!this.props.config.currentAccount) return ( <span /> );

    var cashBalance = this.props.asset.cash ? this.props.asset.cash.toFixed(4) : '-';
    var repBalance = this.props.asset.reputation ? this.props.asset.reputation.toFixed() : '-';
    var etherBalance = this.props.asset.ether ? utilities.formatEther(this.props.asset.ether).value : '-';

    return (
      <div className="panel panel-info assets">
        <div className="panel-heading">Balances</div>
        <div className="panel-body">
          <div className='cash-balance'>
            <span className="unit">cash</span>
            <ButtonGroup className='pull-right send-button'>
              <Button bsSize='xsmall' bsStyle='default' onClick={ this.toggleSendCashModal }>Send</Button>
              <Button disabled={ this.state.cashFaucetDisabled } bsSize='xsmall' bsStyle='default' onClick={ this.onCashFaucet }><i className='fa fa-tint'></i></Button>
            </ButtonGroup>
            <span className='pull-right'>{ cashBalance }</span>
          </div>

          <div className='rep-balance'>
            <span className="unit">reputation</span>
            <ButtonGroup className='pull-right send-button'>
              <Button bsSize='xsmall' bsStyle='default' onClick={ this.toggleSendRepModal }>Send</Button>
              <Button disabled={ this.state.repFaucetDisabled } bsSize='xsmall' bsStyle='default' onClick={ this.onRepFaucet }><i className='fa fa-tint'></i></Button>
            </ButtonGroup>
            <span className='pull-right'>{ repBalance }</span>
          </div>

          <div className='ether-balance'>
            <Button className='pull-right send-button' bsSize='xsmall' bsStyle='default' onClick={ this.toggleSendEtherModal }>Send</Button>
            <span className="unit">{ utilities.formatEther(this.props.asset.ether).unit }</span><span className='pull-right'>{ etherBalance }</span>
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
