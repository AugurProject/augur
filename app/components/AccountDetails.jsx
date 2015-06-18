var React = require('react');
var Fluxxor = require("fluxxor");
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var ReactBootstrap = require('react-bootstrap');
var Button = ReactBootstrap.Button;
var Table = ReactBootstrap.Table;
var ButtonGroup = ReactBootstrap.ButtonGroup;
var Router = require('react-router');
var Link = Router.Link;

var utilities = require('../libs/utilities');

var SendCashTrigger = require('./SendModal').SendCashTrigger;
var SendRepTrigger = require('./SendModal').SendRepTrigger;
var SendEtherTrigger = require('./SendModal').SendEtherTrigger;

var CloseMarketTrigger = require('./CloseMarket').CloseMarketTrigger;

var Markets = require('./Markets');

var AccountDetails = React.createClass({

  mixins: [FluxMixin, StoreWatchMixin('asset')],

  getInitialState: function () {
    return {
      repFaucetDisabled: false,
      cashFaucetDisabled: false
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
      votePeriod: flux.store('branch').getState().currentVotePeriod,
      holdings: flux.store('market').getMarketsHeld()
    }
  },

  onCashFaucet: function(event) {

    this.setState({cashFaucetDisabled: true});
    this.state.ethereumClient.cashFaucet();
  },

  onRepFaucet: function(event) {

    this.setState({repFaucetDisabled: true});
    this.state.ethereumClient.repFaucet();
  },

  render: function () {

    var cashBalance = this.state.asset.cash ? +this.state.asset.cash.toFixed(2) : '-';
    var repBalance = this.state.asset.reputation ? +this.state.asset.reputation.toFixed(2) : 0;


    var holdings = [];
    _.each(this.state.holdings, function (market) {
      _.each(market.outcomes, function(outcome) {
        var name, className, holding;
        if (outcome.sharesHeld.toNumber()) {
          name = outcome.id == 1 ? 'no' : 'yes';
          className = 'shares-held ' + name;
          var key = market.id+outcome.id;
          if (market.expired && market.authored && !market.closed) {
            holding = (
              <tr key={ key }>
                <td>
                  <Link to='market' params={ {marketId: market.id.toString(16) } }>{ market.description }</Link>
                </td>
                <td><span className={ className }>{ outcome.sharesHeld.toNumber() } { name }</span></td>
                <td>{ +outcome.price.toFixed(2) }</td>                
                <td><CloseMarketTrigger text='close market' params={ { marketId: market.id.toString(16), branchId: market.branchId.toString(16) } } /></td>
              </tr>
            );
          } else {
            holding = (
              <tr key={ key }>
                <td>
                  <Link to='market' params={ {marketId: market.id.toString(16) } }>{ market.description }</Link>
                </td>
                <td><span className={ className }>{ outcome.sharesHeld.toNumber() } { name }</span></td>
                <td>{ +outcome.price.toFixed(2) }</td>                
                <td></td>
              </tr>
            );
          }
          holdings.push(holding);
        }
      });
    }, this);

    return (
      <div id="account">
        <h3>Account<span className='subheading pull-right'>{ this.state.primaryAccount }</span></h3>
        <div className='subheading row'>
          <div className='col-sm-4 cash-balance'>
            { cashBalance } <span className='unit'>cash</span>
            <ButtonGroup>
              <SendCashTrigger text='send' />
              <Button bsSize='xsmall' bsStyle='default' onClick={ this.onCashFaucet }>Faucet<i className='fa fa-tint'></i></Button>
            </ButtonGroup>
          </div>
          <div className='col-sm-4 rep-balance'>
            { repBalance } <span className='unit'>rep</span>
            <ButtonGroup>
              <SendRepTrigger text='send' />
              <Button bsSize='xsmall' bsStyle='default' onClick={ this.onRepFaucet }>Faucet<i className='fa fa-tint'></i></Button>
            </ButtonGroup>
          </div>
          <div className='col-sm-4 ether-balance'>
            { utilities.formatEther(this.state.asset.ether).value } <span className='unit'>{ utilities.formatEther(this.state.asset.ether).unit }</span>
            <SendEtherTrigger text='send' />
          </div>
        </div>
        <div className='row'>
          <div className="col-xs-12">
            <h4>Holdings</h4>
            <Table responsive striped hover>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Shares Held</th>
                  <th>Price</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                { holdings }
              </tbody>
            </Table>
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
