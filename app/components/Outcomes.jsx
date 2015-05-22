var _ = require('lodash');
var React = require('react');
var Fluxxor = require('fluxxor');
var FluxMixin = Fluxxor.FluxMixin(React);

var ReactBootstrap = require('react-bootstrap');
var utilities = require('../libs/utilities');
var Input = ReactBootstrap.Input;
var Button = ReactBootstrap.Button;
var Promise = require('es6-promise').Promise;

var NO = 1;
var YES = 2;

var priceToPercentage = function (price) {
  return +price.times(100).toFixed(1);
};

var getOutcomeName = function (id, count) {
  if (count != 2) {
    return id;
  }

  if (id === NO) {
    return 'No';
  } else {
    return 'Yes';
  }
};

var getOutcome = function (outcomeComponent) {
  var outcomes = outcomeComponent.props.market.outcomes;
  var outcomeId = parseInt(outcomeComponent.props.outcome.id);
  return _.find(outcomes, {id: outcomeId});
};

var Overview = React.createClass({

  getInitialState: function () {
    return {
      buyShares: false,
      sellShares: false
    }
  },

  handleSellClick: function() {
    this.setState({sellShares: true});
  },

  handleBuyClick: function() {
    this.setState({buyShares: true});
  },

  handleReturn: function() {
    this.setState({
      buyShares: false,
      sellShares: false
    });
  },

  render: function () {

    var summary;
    var outcome = this.props.outcome;
    var className = 'outcome outcome-'+outcome.id+' shadow';
    if (this.props.market.matured) className += ' matured';

    if (this.state.buyShares) {

      className += ' buy';
      summary =  (
        <Buy {...this.props} handleReturn={ this.handleReturn } />
      );

    } else if (this.state.sellShares) {

      className += ' sell';
      summary = (
        <Sell {...this.props} handleReturn={ this.handleReturn } />
      );

    } else {

      var holdings;
      if (outcome.sharesPurchased.toNumber()) {
        holdings = (
          <div className='sell trade-button'>
            <Button bsStyle='danger' onClick={ this.handleSellClick }>Sell</Button>
            <span className="shares-held btn">{ outcome.sharesPurchased.toNumber() } { outcome.sharesPurchased.toNumber() === 1 ? 'share' : 'shares' } held</span> 
          </div>);
      } else {
        holdings = (
          <div className='sell trade-button'>
            <span className="shares-held none">no shares held</span> 
          </div>);      
      }

      summary = (
        <div className="summary">
          <div className='buy trade-button'>
            <Button bsStyle='success' onClick={ this.handleBuyClick }>Buy</Button>
          </div>
          { holdings }
          <p>{ +outcome.price.toFixed(2) }</p>
          <p>{ +outcome.volume.toFixed(2) } shares</p>
        </div>
      )
    }

    return (
      <div className={ className }>
        <h4>
          <div className="name">{ getOutcomeName(outcome.id, this.props.market.outcomes.length) }</div>
          <div className="price">{ priceToPercentage(outcome.price) }%</div>
        </h4>
        { summary }
      </div>
    );
  }
});

/**
 * Common trading logic.
 *
 * Components that use this must implement:
 * - actionLabel
 * - getHelpText
 * - getSimulationFunction
 * - getTradeFunction
 */
var TradeBase = {
  mixins: [FluxMixin],

  getInitialState: function () {
    return {
      ownedShares: this.getOwnedShares(),
      tradeDisabled: false,
      simulation: null,
      inputError: null,
      value: ''
    }
  },

  getOutcomeId: function () {
    return parseInt(this.props.outcome.id);
  },

  getPrice: function () {
    var outcome = getOutcome(this);
    return outcome.price;
  },

  getOwnedShares: function () {
    var outcome = getOutcome(this);
    return outcome.sharesPurchased.toNumber();
  },

  handleChange: function () {
    var rawValue = this.refs.input.getValue()
    var numShares = parseFloat(rawValue);
    var self = this;

    this.setState({
      value: rawValue,
      inputError: null
    });

    if (!numShares) {
      this.setState({
        simulation: null
      });
    } else {

      new Promise((resolve, reject) => {
        utilities.debug('requesting simulation:', this.props.market.id.toString(16), this.getOutcomeId(), numShares);
        this.getSimulationFunction()(
          this.props.market.id,
          this.getOutcomeId(),
          numShares,
          resolve
        );
      }).then((simulation) => {
        utilities.debug('setting simulation:', simulation.cost.toFixed(3), simulation.newPrice.toFixed(3));

        this.setState({
          simulation: simulation
        });
      });
    }
  },

  onSubmit: function (event) {

    event.preventDefault();

    var numShares = parseFloat(this.state.value);
    if (typeof(numShares) !== 'number' || !numShares) {
      this.setState({inputError: 'Shares must be a numeric value'});
    } else if (this.state.simulation.cost > this.props.cashBalance) {
      this.setState({inputError: 'Cost of shares exceeds funds'});
    } else {

      var self = this;
      this.getTradeFunction()(
        this.props.market.branchId,
        this.props.market.id,
        this.getOutcomeId(),
        numShares,
        // on sent
        function(result) {
          utilities.log('trade submitted: ' + result);
          self.setState({
            ownedShares: self.getOwnedSharesAfterTrade(numShares),
            tradeDisabled: true
          });
          self.props.handleReturn();
        },
        // on success
        function(result) {
          utilities.log('trade completed');
        },
        // on failed
        function(error) {
          utilities.error('trade failed: ' + result);
          self.setState({
            tradeDisabled: false
          });
        }  
      );
    }   
  },

  render: function () {

    var outcomeCount = this.props.market.outcomes.length;
    var outcome = this.props.outcome;

    var buttonStyle = this.actionLabel === 'Sell' ? 'danger' : 'success';
    var submit = (
      <Button bsStyle={ buttonStyle } type="submit">{ this.actionLabel }</Button>
    );
    var inputStyle = this.state.inputError ? 'error' : null;

    return (
      <div className="summary trade">
        <div className='buy trade-button'>
          <form onSubmit={ this.onSubmit }>
            <Input
              type="text"
              bsStyle={ inputStyle }
              value={ this.state.value }
              help={ this.getHelpText() }
              ref="input"
              placeholder='Shares'
              onChange={ this.handleChange } 
              buttonAfter={ submit }
            />
          </form>
        </div>
        <div className='cancel trade-button'>
          <Button bsStyle='default' onClick={ this.props.handleReturn } bsSize='small'>CANCEL</Button>
        </div>
        <p>{ +outcome.price.toFixed(2) }</p>
        <p>{ outcome.sharesPurchased.toNumber() } { outcome.sharesPurchased.toNumber() === 1 ? 'share' : 'shares' } held</p>
        <p className='new-price'>{ this.getPriceDelta() }</p>
      </div>
    );
  }
};

var Buy = React.createClass(_.merge({
  actionLabel: 'Buy',

  getHelpText: function () {
    if (this.state.inputError) {
      return ( this.state.inputError );
    } else if (this.state.simulation) {
      return ( 'Cost: ' + this.state.simulation.cost.toFixed(3) );
    } else {
      return '';
    }
  },

  getPriceDelta: function () {

    if (!this.state.simulation) {
      return '';
    }

    var newPrice = priceToPercentage(this.state.simulation.newPrice);
    return (
      <span>
        <i className='fa fa-chevron-up' style={{color: 'green'}}></i>
        <span className='new-price'>{ newPrice }%</span>
      </span>
    );
  },

  getSimulationFunction: function () {
    var flux = this.getFlux();
    var client = flux.store('config').getEthereumClient();
    return client.getSimulatedBuy;
  },

  getTradeFunction: function () {
    var flux = this.getFlux();
    var client = flux.store('config').getEthereumClient();
    return client.buyShares;
  },

  getOwnedSharesAfterTrade: function (numShares) {
    return this.state.ownedShares + numShares;
  }
}, TradeBase));

var Sell = React.createClass(_.merge({
  actionLabel: 'Sell',

  getHelpText: function () {
    if (!this.state.simulation) {
      return '';
    }
    return (
      'Cost: ' + this.state.simulation.cost.toFixed(3)
    );
  },

  getPriceDelta: function () {

    if (!this.state.simulation) {
      return '';
    }
    var newPrice = priceToPercentage(this.state.simulation.newPrice);
    return (
      <span>
        <i className='fa fa-chevron-down' style={{color: 'red'}}></i>
        <span className='new-price'>{ newPrice }%</span>
      </span>
    );
  },

  getSimulationFunction: function () {
    var flux = this.getFlux();
    var client = flux.store('config').getEthereumClient();
    return client.getSimulatedSell;
  },

  getTradeFunction: function (numShares, callback) {
    var flux = this.getFlux();
    var client = flux.store('config').getEthereumClient();
    return client.sellShares;
  },

  getOwnedSharesAfterTrade: function (numShares) {
    return this.state.ownedShares - numShares;
  }
}, TradeBase));

module.exports = {
  Buy: Buy,
  Sell: Sell,
  Overview: Overview
};
