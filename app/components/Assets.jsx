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
        console.log('warning: not enough ether'); 
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

    // <span className="unit">cash</span>
          //     <div className="col-sm-1">
          //   <ButtonGroup className='pull-right send-button'>
          //     <Button bsSize='xsmall' bsStyle='default' onClick={ this.toggleSendCashModal }>Send</Button>
          //     <Button disabled={ this.state.cashFaucetDisabled } bsSize='xsmall' bsStyle='default' onClick={ this.onCashFaucet }><i className='fa fa-tint'></i></Button>
          //   </ButtonGroup>
          // </div>

    // <span className="unit">reputation</span>
          //     <div className="col-sm-4">
          //   <ButtonGroup className='pull-right send-button'>
          //     <Button bsSize='xsmall' bsStyle='default' onClick={ this.toggleSendRepModal }>Send</Button>
          //     <Button disabled={ this.state.repFaucetDisabled } bsSize='xsmall' bsStyle='default' onClick={ this.onRepFaucet }><i className='fa fa-tint'></i></Button>
          //   </ButtonGroup>
          // </div>

          // <div className="col-sm-4">
          //   <Button className='pull-right send-button' bsSize='xsmall' bsStyle='default' onClick={ this.toggleSendEtherModal }>Send</Button>
          // </div>

        //   <div className="col-sm-3">
        //   <span className="unit">{ utilities.formatEther(this.props.asset.ether).unit }</span><span className='pull-right'>{ etherBalance }</span>
        // </div>

      //           <SendEtherModal show={ this.state.sendEtherModalOpen } onHide={ this.toggleSendEtherModal } />
      // <SendRepModal show={ this.state.sendRepModalOpen } onHide={ this.toggleSendRepModal } />
      // <SendCashModal show={ this.state.sendCashModalOpen } onHide={ this.toggleSendCashModal } />

    return (
      <div className="panel-body col-sm-8 pull-right">
        <div className="col-sm-4">
          <span className="fa-stack fa-md">
            <i className="fa fa-circle fa-stack-2x icon-background2"></i>
            <i className="fa fa-btc fa-stack-1x"></i>
          </span>
          <span className='pull-right balance'>{ cashBalance }</span>
        </div>

        <div className="col-sm-4">
          <span className="fa-stack fa-md">
            <i className="fa fa-circle fa-stack-2x icon-background4"></i>
             <i className="fa fa-circle-thin fa-stack-2x icon-background6"></i>
            <i className="fa fa-heart fa-stack-1x"></i>
          </span>
          <span className='pull-right balance'>{ repBalance }</span>
        </div>
      </div>
    );
  }
});

module.exports = Assets;
