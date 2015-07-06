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
var constants = require('../libs/constants');

var SendCashModal = require('./SendModal').SendCashModal;
var SendRepModal = require('./SendModal').SendRepModal;
var SendEtherModal = require('./SendModal').SendEtherModal;

var CloseMarketModal = require('./CloseMarket').CloseMarketModal;

var EtherWarningModal = require('./EtherWarningModal');
var Markets = require('./Markets');

var AccountDetails = React.createClass({

  mixins: [FluxMixin, StoreWatchMixin('asset')],

  getInitialState: function () {
    return {
      repFaucetDisabled: false,
      cashFaucetDisabled: false,
      sendCashModalOpen: false,
      sendRepModalOpen: false,
      sendEtherModalOpen: false
    };
  },

  getStateFromFlux: function () {
    var flux = this.getFlux();
    var account = flux.store('network').getAccount();

    return {
      account: account,
      allAccounts: flux.store('network').getState().accounts,
      asset: flux.store('asset').getState(),
      ethereumClient: flux.store('config').getEthereumClient(),
      authoredMarkets: flux.store('market').getMarketsByAuthor(account),
      votePeriod: flux.store('branch').getState().currentVotePeriod,
      holdings: flux.store('market').getMarketsHeld()
    }
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

    var cashBalance = this.state.asset.cash ? +this.state.asset.cash.toFixed(2) : '-';
    var repBalance = this.state.asset.reputation ? +this.state.asset.reputation.toFixed(2) : 0;

    var holdings = [];
    _.each(this.state.holdings, function (market) {
      _.each(market.outcomes, function(outcome) {
        var name, className, holding;
        if (outcome && outcome.sharesHeld && outcome.sharesHeld.toNumber()) {
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

    var cashFaucetDisabled = this.state.cashFaucetDisabled ? true : false;
    var repFaucetDisabled = this.state.repFaucetDisabled ? true : false;

    var rendered = (
      <div id="account">
        <h3>Account<span className='subheading pull-right'>{ this.state.account }</span></h3>
        <div className='subheading row'>
          <div className='col-sm-4 cash-balance'>
            { cashBalance } <span className='unit'>cash</span>
            <ButtonGroup>
              <Button bsSize='xsmall' bsStyle='primary' onClick={ this.toggleSendCashModal }>Send</Button>
              <Button disabled={ cashFaucetDisabled } bsSize='xsmall' bsStyle='default' onClick={ this.onCashFaucet }>Faucet<i className='fa fa-tint'></i></Button>
            </ButtonGroup>
          </div>
          <div className='col-sm-4 rep-balance'>
            { repBalance } <span className='unit'>rep</span>
            <ButtonGroup>
              <Button bsSize='xsmall' bsStyle='primary' onClick={ this.toggleSendRepModal }>Send</Button>
              <Button disabled={ repFaucetDisabled } bsSize='xsmall' bsStyle='default' onClick={ this.onRepFaucet }>Faucet<i className='fa fa-tint'></i></Button>
            </ButtonGroup>
          </div>
          <div className='col-sm-4 ether-balance'>
            { utilities.formatEther(this.state.asset.ether).value } <span className='unit'>{ utilities.formatEther(this.state.asset.ether).unit }</span>
            <Button bsSize='xsmall' bsStyle='primary' onClick={ this.toggleSendEtherModal }>Send</Button>
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

        <SendEtherModal show={ this.state.sendEtherModalOpen } onHide={ this.toggleSendEtherModal } />
        <SendRepModal show={ this.state.sendRepModalOpen } onHide={ this.toggleSendRepModal } />
        <SendCashModal show={ this.state.sendCashModalOpen } onHide={ this.toggleSendCashModal } />

      </div>
    );

    return rendered;
  }
});

module.exports = AccountDetails;
