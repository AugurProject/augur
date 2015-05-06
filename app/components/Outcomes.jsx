var _ = require('lodash');
var React = require('react');
var Fluxxor = require('fluxxor');
var FluxMixin = Fluxxor.FluxMixin(React);
var Router = require('react-router');
var Link = Router.Link;
var ReactBootstrap = require('react-bootstrap');
var Input = ReactBootstrap.Input;
var Button = ReactBootstrap.Button;
var Promise = require('es6-promise').Promise;

var NO = 1;
var YES = 2;

var priceToPercentage = function (price) {
  return Math.floor(parseFloat(price) * 100).toString();
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
      <div>
        <div className="outcome outcome{ this.props.id }">
          <h3>
            <div className="name">{ getOutcomeName(this.props.id, this.props.outcomeCount) }</div>
            <div className="price">{ priceToPercentage(this.props.price) }%</div>
          </h3>
          <div className="summary">
            <div className='buy trade'>
              <Link to="buy-outcome" className="btn btn-success" params={{marketId: this.props.params.marketId, outcomeId: this.props.id}}>Buy</Link>
            </div>
            { holdings }
            <p>{ +this.props.volume.toFixed(2) } shares</p>
            <p>${ +this.props.price.toFixed(2) }</p>
          </div>
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
    var numShares = parseInt(rawValue);

    this.setState({
      value: rawValue
    });

    if (!numShares) {
      console.log('Clearing simulation.');
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
        console.log('Setting simulation: ', simulation);
        this.setState({
          simulation: simulation
        });
      });
    }
  },

  onSubmit: function (event) {
    event.preventDefault();
    var numShares = parseInt(this.state.value);
    console.log('Trading ' + numShares + ' shares...');

    new Promise((resolve) => {
      this.getTradeFunction()(
        this.props.market.branchId,
        this.props.market.id,
        this.getOutcomeId(),
        numShares,
        resolve
      );
    }).then((returnCode) => {
      console.log('Trade function returned ', returnCode);
      this.setState({
        ownedShares: this.getOwnedSharesAfterTrade(numShares),
        value: ''
      });
    });
  },

  render: function () {

    var outcomeCount = this.props.market.outcomes.length;

    var style = this.actionLabel === 'Sell' ? 'danger' : 'success';
    var submit = (
      <Button bsStyle={ style } type="submit">{ this.actionLabel }</Button>
    );

    return (
      <div className='execute-trade'>
          <h4>{ this.actionLabel } shares of <b>{ getOutcomeName(this.getOutcomeId(), outcomeCount) }</b></h4>
          <h3 className="price">{ priceToPercentage(this.getPrice()) }% { this.getPriceDelta() }</h3>
          <p className="shares-held">Shares held: { this.state.ownedShares }</p>
          <p className="shares-held">Cash balance: { this.state.cashBalance }</p>
          <form onSubmit={ this.onSubmit }>
            <Input
              type="text"
              value={ this.state.value }
              help={ this.getHelpText() }
              ref="input"
              placeholder='Shares'
              onChange={ this.handleChange } 
              buttonAfter={ submit }
            />
          </form>
      </div>
    );
  }
};

var Buy = React.createClass(_.merge({
  actionLabel: 'Buy',

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
