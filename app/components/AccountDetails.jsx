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

var Markets = require('./Markets');

var AccountDetails = React.createClass({

  mixins: [FluxMixin, StoreWatchMixin('asset')],

  getInitialState: function () {
    return {
    };
  },

  getStateFromFlux: function () {
    var flux = this.getFlux();
    var account = flux.store('network').getAccount();

    return {
      primaryAccount: account,
      allAccounts:flux.store('network').getState().accounts,
      asset: flux.store('asset').getState(),
      ethereumClient: flux.store('config').getEthereumClient(),
      authoredMarkets: flux.store('market').getMarketsByAuthor(account),
      votePeriod: flux.store('branch').getState().currentVotePeriod
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
        <h3>Account<span className='subheading pull-right'>{ this.state.primaryAccount }</span></h3>
        <div className='subheading row'>
          <div className='col-sm-4 cash-balance'>
            { cashBalance } <span className='unit'>cash</span>
            <SendCashTrigger text='send' />
            <Button bsSize='xsmall' bsStyle='default' onClick={ this.onCashFaucet }>Faucet<i className='fa fa-tint'></i></Button>
          </div>
          <div className='col-sm-4 rep-balance'>
            { this.state.asset.reputation } <span className='unit'>reputation</span>
            <SendRepTrigger text='send' />
            <Button bsSize='xsmall' bsStyle='default' onClick={ this.onRepFaucet }>Faucet<i className='fa fa-tint'></i></Button>
          </div>
          <div className='col-sm-4 ether-balance'>
            { utilities.formatEther(this.state.asset.ether).value } <span className='unit'>{ utilities.formatEther(this.state.asset.ether).unit }</span>
            <SendEtherTrigger text='send' />
          </div>
        </div>
        <div className='row'>
          <div className="col-xs-12">
            <h4>Holdings</h4>

            <h4>Authored Markets</h4>
            <div className='authored-markets row'>
              <Markets 
                markets={ this.state.authoredMarkets }
                votePeriod={ this.state.votePeriod }
                classNameWrapper='col-sm-4' />
            </div>
        
          </div>
        </div>
      </div>
    );
  }
});

module.exports = AccountDetails;
