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
  return price.times(100).floor().toString()
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
      <div className="outcome outcome-{ this.props.id } col-md-6">
        <h3>{ getOutcomeName(this.props.id, this.props.outcomeCount) }</h3>
        <div className="price">{ priceToPercentage(this.props.price) }%</div>
        <p className="shares-held">Shares held: 0</p>
        <Link to="buy-outcome" className="btn btn-success" params={{marketId: this.props.params.marketId, outcomeId: this.props.id}}>Buy</Link>
        <Link to="sell-outcome" className="btn btn-danger" params={{marketId: this.props.params.marketId, outcomeId: this.props.id}}>Sell</Link>
      </div>
    );
  }
});

var Buy = React.createClass({
  mixins: [FluxMixin],

  getInitialState: function () {
    return {
      ownedShares: 0,
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

  getHelpText: function () {
    if (!this.state.simulation) {
      return 'Enter the number of shares to see the cost.';
    }

    return (
      'Cost: ' + this.state.simulation.cost.toString() + ' cash. ' +
      'New forecast: ' + priceToPercentage(this.state.simulation.newPrice) + '%'
    );
  },

  getSimulatedBuy: function (numShares, callback) {
    var flux = this.getFlux();
    var client = flux.store('config').getEthereumClient();
    client.getSimulatedBuy(this.props.market.id, this.getOutcomeId(), numShares, callback);
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
        this.getSimulatedBuy(numShares, resolve);
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
    console.log('Buying ' + numShares + ' shares...');

    var flux = this.getFlux();
    var client = flux.store('config').getEthereumClient();
    new Promise((resolve, reject) => {
      client.buyShares(
        this.props.market.branchId,
        this.props.market.id,
        this.getOutcomeId(),
        numShares,
        resolve
      );
    }).then((returnCode) => {
      console.log('buyShares returned ', returnCode);
      this.setState({
        ownedShares: numShares,
        value: ''
      });
    });
  },

  render: function () {
    var outcomeCount = this.props.market.outcomes.length;

    return (
      <div>
        <h3>Purchase "{ getOutcomeName(this.getOutcomeId(), outcomeCount) }" Shares</h3>
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
});

var Sell = React.createClass({
  render: function () {
    return (
      <div>
        <h3>Sell Shares</h3>
      </div>
    );
  }
});

module.exports = {
  Buy: Buy,
  Sell: Sell,
  Overview: Overview
};
