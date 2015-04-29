var _ = require('lodash');
var React = require('react');
var Fluxxor = require('fluxxor');
var FluxMixin = Fluxxor.FluxMixin(React);
var Router = require('react-router');
var Link = Router.Link;
var ReactBootstrap = require('react-bootstrap');
var Input = ReactBootstrap.Input;

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
      simulations: {},
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
    if (!this.state.value) {
      return 'Enter the number of shares to see the cost.';
    }

    var simulation = this.getSimulatedBuy(parseInt(this.state.value));
    return 'Cost: ' + simulation.cost.toString() + ' cash. New forecast: ' + priceToPercentage(simulation.newPrice) + '%';
  },

  getSimulatedBuy: function (numShares) {
    var flux = this.getFlux();
    var client = flux.store('config').getEthereumClient();
    return client.getSimulatedBuy(this.props.market.marketId, this.getOutcomeId(), numShares);
  },

  handleChange: function () {
    this.setState({
      value: this.refs.input.getValue()
    });
  },

  render: function () {
    var outcomeCount = this.props.market.outcomes.length;

    return (
      <div>
        <h3>Purchase "{ getOutcomeName(this.getOutcomeId(), outcomeCount) }" Shares</h3>
        <div className="price">{ priceToPercentage(this.getPrice()) }%</div>
        <p className="shares-held">Shares held: 0</p>
        <form>
          <Input
            type='text'
            value={this.state.value}
            label='Shares'
            help={this.getHelpText()}
            ref='input'
            onChange={this.handleChange} />

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
