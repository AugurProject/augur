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
      sendCashModalOpen: false,
      sendRepModalOpen: false,
      sendEtherModalOpen: false
    };
  },

  onRepFaucet: function (event) {
    if (!this.state.repFaucetDisabled) {
      if (this.props.asset.ether.toNumber() < constants.MIN_ETHER_WARNING) {
        console.log('warning: not enough ether');
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
      <div>
        <div className="row">
          <div className='cash-balance col-sm-12'>
            <div className="col-sm-4">
              <span className="unit">cash</span>
            </div>
            <div className="col-sm-4">
              <Button bsSize='xsmall' className='pull-right' bsStyle='default' onClick={ this.toggleSendCashModal }>Send</Button>
            </div>
            <div className="col-sm-4">
              <span className='pull-right'>{ cashBalance }</span>
            </div>
          </div>
        </div>
        <div className="row">
          <div className='ether-balance col-sm-12'>
            <Button className='pull-right send-button' bsSize='xsmall' bsStyle='default' onClick={ this.toggleSendEtherModal }>Send</Button>
            <span className="unit">{ utilities.formatEther(this.props.asset.ether).unit }</span><span className='pull-right'>{ etherBalance }</span>
          </div>
        </div>
        <div className="row">
          <div className='rep-balance col-sm-12'>
            <span className="unit">reputation</span>
            <ButtonGroup className='pull-right send-button'>
              <Button bsSize='xsmall' bsStyle='default' onClick={ this.toggleSendRepModal }>Send</Button>
              <Button disabled={ this.state.repFaucetDisabled } bsSize='xsmall' bsStyle='default' onClick={ this.onRepFaucet }><i className='fa fa-tint'></i></Button>
            </ButtonGroup>
            <span className='pull-right'>{ repBalance }</span>
          </div>
        </div>
        <SendEtherModal show={ this.state.sendEtherModalOpen } onHide={ this.toggleSendEtherModal } />
        <SendRepModal show={ this.state.sendRepModalOpen } onHide={ this.toggleSendRepModal } />
        <SendCashModal show={ this.state.sendCashModalOpen } onHide={ this.toggleSendCashModal } />
      </div>
    );
  }
});

module.exports = Assets;
