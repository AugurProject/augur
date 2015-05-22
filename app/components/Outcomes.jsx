var _ = require('lodash');
var React = require('react');
var Fluxxor = require('fluxxor');
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

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

  mixins: [FluxMixin],

  getInitialState: function () {
    return {
      buyShares: false,
      sellShares: false,
      pendingShares: null
    }
  },

  handleSellClick: function() {
    this.setState({sellShares: true});
  },

  handleBuyClick: function() {
    this.setState({buyShares: true});
  },

  handleCancel: function() {
    this.setState({
      buyShares: false,
      sellShares: false
    });
  },

  updateShareHelds: function () {

      //var flux = this.getFlux();
      //flux.actions.market.updateSharesHeld(this.props.market.id, this.props.outcome.id, pendingShares);
  },

  getTradeFunction: function (shares) {

    var flux = this.getFlux();
    var client = flux.store('config').getEthereumClient();

    return (shares < 0) ? client.sellShares : client.buyShares;
  },

  handleTrade: function (relativeShares) {

    event.preventDefault();

    var self = this;
    var absShares = Math.abs(relativeShares);

    this.getTradeFunction(relativeShares)(

      this.props.market.branchId,
      this.props.market.id,
      this.props.outcome.id,
      absShares,

      // on sent
      function(result) {
        utilities.debug('trade submitted: ' + result);
        // TODO: check if component is mounted
        self.setState({
          pendingShares: relativeShares,
          buyShares: false,
          sellShares: false
        });
      },

      // on success
      function(result) {
        utilities.debug('trade completed');

        // TODO: check if component is mounted
        self.setState({
          pendingShares: null
        });
      },

      // on failed
      function(error) {
        utilities.debug('trade failed: ' + result);
        // TODO: check if component is mounted
        self.setState({
          pendingShares: null
        });
      }  
    );


  },

  render: function () {

    var summary;
    var outcome = this.props.outcome;
    var className = 'outcome outcome-'+outcome.id+' shadow';
    if (this.props.market.matured) className += ' matured';

    if (this.state.buyShares) {

      className += ' buy';
      summary =  (
        <Buy {...this.props} handleTrade={ this.handleTrade } handleCancel={ this.handleCancel } />
      );

    } else if (this.state.sellShares) {

      className += ' sell';
      summary = (
        <Sell {...this.props} handleTrade={ this.handleTrade } handleCancel={ this.handleCancel } /> 
      );

    } else {

      var pendingShares = ( <span /> )
      if (this.state.pendingShares) {
        var shares = this.state.pendingShares;
        var sharesString = shares < 0 ? shares.toString() : '+'+shares;
        var color = shares < 0 ? 'red' : 'green';
        pendingShares = (
          <b style={ {color: color} }>{ sharesString }</b>
        )
      }

      var holdings;
      if (outcome.sharesHeld.toNumber()) {
        holdings = (
          <div className='sell trade-button'>
            <Button bsStyle='danger' onClick={ this.handleSellClick }>Sell</Button>
            <span className="shares-held btn">{ outcome.sharesHeld.toNumber() }{ pendingShares } { outcome.sharesHeld.toNumber() === 1 ? 'share' : 'shares' } held</span> 
          </div>);
      } else if (this.state.pendingShares) {
        holdings = (
          <div className='sell trade-button'>
            <span className="shares-held none">{ this.state.pendingShares } shares pending</span> 
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
      sharesHeld: this.getSharesHeld(),
      simulation: null,
      inputError: null,
      value: ''
    }
  },

  getPrice: function () {
    var outcome = getOutcome(this);
    return outcome.price;
  },

  getSharesHeld: function () {
    var outcome = getOutcome(this);
    return outcome.sharesHeld.toNumber();
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
        this.getSimulationFunction()(
          this.props.market.id,
          this.props.outcome.id,
          numShares,
          resolve
        );
      }).then((simulation) => {
        this.setState({
          simulation: simulation
        });
      });
    }
  },

  onSubmit: function (event) {

    var numShares = parseFloat(this.state.value);

    if (typeof(numShares) !== 'number' || !numShares) {
      this.setState({inputError: 'Shares must be a numeric value'});
    } else if (this.state.simulation.cost > this.props.cashBalance) {
      this.setState({inputError: 'Cost of shares exceeds funds'});
    } else {

      var relativeShares = this.getRelativeShares();
      this.props.handleTrade(relativeShares);
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
          <Button bsStyle='default' onClick={ this.props.handleCancel } bsSize='small'>CANCEL</Button>
        </div>
        <p>{ +outcome.price.toFixed(2) }</p>
        <p>{ outcome.sharesHeld.toNumber() } { outcome.sharesHeld.toNumber() === 1 ? 'share' : 'shares' } held</p>
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

  getRelativeShares: function() {
    return this.state.value;
  },

  getSimulationFunction: function () {
    var flux = this.getFlux();
    var client = flux.store('config').getEthereumClient();
    return client.getSimulatedBuy;
  }

}, TradeBase));


var Sell = React.createClass(_.merge({

  actionLabel: 'Sell',

  getHelpText: function () {
    if (!this.state.simulation) {
      return '';
    }
    return (
      'Return: ' + this.state.simulation.cost.toFixed(3)
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

  getRelativeShares: function() {
    return this.state.value * -1;
  },

  getSimulationFunction: function () {
    var flux = this.getFlux();
    var client = flux.store('config').getEthereumClient();
    return client.getSimulatedSell;
  }

}, TradeBase));

module.exports = {
  Buy: Buy,
  Sell: Sell,
  Overview: Overview
};
