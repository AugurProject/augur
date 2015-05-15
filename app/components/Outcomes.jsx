var _ = require('lodash');
var React = require('react');
var Fluxxor = require('fluxxor');
var FluxMixin = Fluxxor.FluxMixin(React);
var Router = require('react-router');
var Link = Router.Link;
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
  var outcomeId = parseInt(outcomeComponent.props.params.outcomeId);
  return _.find(outcomes, {id: outcomeId});
};

var Overview = React.createClass({
  render: function () {

    var className = 'outcome outcome-'+this.props.id+' shadow';
    if (this.props.matured) className += ' matured';

    var holdings;
    if (this.props.sharesPurchased.toNumber()) {
      holdings = (
        <div className='sell trade'>
          <Link to="sell-outcome" className="btn btn-danger form-control" params={{marketId: this.props.params.marketId, outcomeId: this.props.id}}>Sell</Link>
          <span className="shares-held btn">{ this.props.sharesPurchased.toNumber() } shares held</span> 
        </div>);
    } else {
      holdings = (
        <div className='sell trade'>
          <span className="shares-held none">no shares held</span> 
        </div>);      
    }
    return (
      <div className={ className }>
        <h4>
          <div className="name">{ getOutcomeName(this.props.id, this.props.outcomeCount) }</div>
          <div className="price">{ priceToPercentage(this.props.price) }%</div>
        </h4>
        <div className="summary">
          <div className='buy trade'>
            <Link to="buy-outcome" className="btn btn-success" params={{marketId: this.props.params.marketId, outcomeId: this.props.id}}>Buy</Link>
          </div>
          { holdings }
          <p>{ +this.props.volume.toFixed(2) } shares</p>
          <p>{ +this.props.price.toFixed(3) }</p>
        </div>
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
      simulation: null,
      inputError: null,
      value: ''
    }
  },

  getOutcomeId: function () {
    return parseInt(this.props.params.outcomeId);
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
        console.log('Getting simulation...');
        this.getSimulationFunction()(
          this.props.market.id,
          this.getOutcomeId(),
          numShares,
          resolve
        );
      }).then((simulation) => {
        console.log('Setting simulation: ', simulation.cost.toNumber(), simulation.newPrice.toNumber());

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

      new Promise((resolve) => {
        this.getTradeFunction()(
          this.props.market.branchId,
          this.props.market.id,
          this.getOutcomeId(),
          numShares,
          resolve
        );
      }).then((tx) => {
        console.log('Trade returned ' +tx.toString(16));
        this.setState({
          ownedShares: this.getOwnedSharesAfterTrade(numShares),
          value: ''
        });
      });
    }
  },

  render: function () {

    var outcomeCount = this.props.market.outcomes.length;

    var buttonStyle = this.actionLabel === 'Sell' ? 'danger' : 'success';
    var submit = (
      <Button bsStyle={ buttonStyle } type="submit">{ this.actionLabel }</Button>
    );
    var inputStyle = this.state.inputError ? 'error' : '';

    return (
      <div className='execute-trade shadow'>
        <div className='row'>
          <div className='col-sm-4'>
            <h4>{ this.actionLabel } shares of <b>{ getOutcomeName(this.getOutcomeId(), outcomeCount) }</b></h4>
            <h4 className="price">{ priceToPercentage(this.getPrice()) }% { this.getPriceDelta() }</h4>
          </div>
          <div className='col-sm-4'>
            <p className="shares-held">Shares held: { this.state.ownedShares }</p>
            <p className="shares-held">Cash balance: { this.props.cashBalance }</p>
          </div>
          <div className='col-sm-4'>        
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
        </div>
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
