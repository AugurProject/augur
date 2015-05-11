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
      asset: flux.store('asset').getState(),
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

    var cashBalance = this.state.asset.cash ? +this.state.asset.cash.toFixed(2) : '-';

    return (
      <div id="account">
        <h3>Account Overview</h3>
        <div className='subheading'>{ this.state.primaryAccount }</div>
        <div className='row'>
          <div className="col-sm-6 col-lg-7">
            <h4>Holdings</h4>

            <h4>Markets</h4>

          </div>
          <div className="col-sm-6 col-lg-5">
            <div className='balances'>
              <h4>Balances</h4>
              <p>
                <b>Cash</b>
                <span className='balance'>
                  { cashBalance }
                  <SendCashTrigger text='send' />
                  <Button bsSize='xsmall' bsStyle='default' onClick={ this.onCashFaucet }>Faucet<i className='fa fa-tint'></i></Button>
                </span>
              </p>
              <p>
                <b>Reputation</b>
                <span className='balance'>
                  { this.state.asset.reputation }
                  <SendRepTrigger text='send' />
                  <Button bsSize='xsmall' bsStyle='default' onClick={ this.onRepFaucet }>Faucet<i className='fa fa-tint'></i></Button>
                </span>
              </p>
              <p>
                <b>Ether</b>
                <span className='balance'>
                  { utilities.formatEther(this.state.asset.ether) }
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
