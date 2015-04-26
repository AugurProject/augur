var React = require('react');
var Fluxxor = require("fluxxor");
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var ReactBootstrap = require('react-bootstrap');
var Button = ReactBootstrap.Button;
var utilities = require('../libs/utilities');

var SendCashTrigger = require('./SendCash').SendCashTrigger;
var SendRepTrigger = require('./SendRep').SendRepTrigger;
var SendEtherTrigger = require('./SendEther').SendEtherTrigger;

var AccountDetails = React.createClass({

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
      assets: flux.store('asset').getState(),
      ethereumClient: flux.store('config').getEthereumClient()
    }
  },

  onCashFaucet: function(event) {

    this.state.ethereumClient.cashFaucet();
  },

  onRepFaucet: function(event) {

    this.state.ethereumClient.repFaucet();
  },

  render: function () {
    return (
      <div id="account">
        <h3>Account Overview<span className='subheading pull-right'>{ this.state.primaryAccount }</span></h3>
        <div className='row'>
          <div className="col-sm-6 col-lg-7">
            <h4>Holdings</h4>
          </div>
          <div className="col-sm-6 col-lg-5">
            <div className='balances'>
              <h4>Balances</h4>
              <p>
                <b>Cash</b>
                <span className='balance'>
                  { this.state.assets.cash }
                  <SendCashTrigger text='send' />
                  <Button bsSize='xsmall' bsStyle='default' onClick={ this.onCashFaucet }>Faucet<i className='fa fa-tint'></i></Button>
                </span>
              </p>
              <p>
                <b>Reputation</b>
                <span className='balance'>
                  { this.state.assets.reputation }
                  <SendRepTrigger text='send' />
                  <Button bsSize='xsmall' bsStyle='default' onClick={ this.onRepFaucet }>Faucet<i className='fa fa-tint'></i></Button>
                </span>
              </p>
              <p>
                <b>Ether</b>
                <span className='balance'>
                  { utilities.formatEther(this.state.assets.ether) }
                  <SendEtherTrigger text='send' />
                  <Button bsSize='xsmall' bsStyle='default' style={{visibility: 'hidden'}}>Faucet<i className='fa fa-tint'></i></Button>
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = AccountDetails;
