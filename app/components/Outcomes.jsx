var _ = require('lodash');
var React = require('react');
var Fluxxor = require('fluxxor');
var FluxMixin = Fluxxor.FluxMixin(React);
var Router = require('react-router');
var Link = Router.Link;
var ReactBootstrap = require('react-bootstrap');
var Input = ReactBootstrap.Input;
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
    return (
      <div>
        <div className="outcome outcome-{ this.props.id }">
          <div className="row">
            <div className="col-sm-7">
              <h3>
                { getOutcomeName(this.props.id, this.props.outcomeCount) }
                <span className="price pull-right">{ priceToPercentage(this.props.price) }% <b>({ this.props.sharesPurchased.toString() } shares)</b></span>
              </h3>
            </div>
            <div className="col-sm-5">
              <Link to="buy-outcome" bsSize='large' className="btn btn-success pull-right" params={{marketId: this.props.params.marketId, outcomeId: this.props.id}}>Buy</Link>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-6">
            </div>
            <div className="col-sm-6">
              <Link to="sell-outcome" bsSize='large' className="btn btn-danger pull-right" params={{marketId: this.props.params.marketId, outcomeId: this.props.id}}>Sell</Link>
            </div>
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

    return (
      <div>
        <h3>{this.actionLabel} "{ getOutcomeName(this.getOutcomeId(), outcomeCount) }" Shares</h3>
        <div className="price">{ priceToPercentage(this.getPrice()) }%</div>
        <p className="shares-held">Shares held: {this.state.ownedShares}</p>
        <form onSubmit={this.onSubmit}>
          <Input
            type="text"
            value={this.state.value}
            label="Shares"
            help={this.getHelpText()}
            ref="input"
            onChange={this.handleChange} />
          <Input type="submit" />
        </form>
      </div>
    );
  }
};

var Buy = React.createClass(_.merge({
  actionLabel: 'Purchase',

  getHelpText: function () {
    if (!this.state.simulation) {
      return 'Enter the number of shares to see the cost.';
    }

    return (
      'Cost: ' + this.state.simulation.cost.toString() + ' cash. ' +
      'New forecast: ' + priceToPercentage(this.state.simulation.newPrice) + '%'
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
      return 'Enter the number of shares to see their value.';
    }

    return (
      'Value: ' + this.state.simulation.cost.toString() + ' cash. ' +
      'New forecast: ' + priceToPercentage(this.state.simulation.newPrice) + '%'
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
