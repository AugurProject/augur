var _ = require('lodash');
var React = require('react');
var Fluxxor = require("fluxxor");
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

// bundling this list class here for now until needed for reuse
var MarketList = React.createClass({

  render: function() {
    var marketList = _.map(this.props.data, function (market) {
      return (
        <div className='market-pane' id='market-{ market.id }'>
          <h4>{ market.text }</h4>
          <div className='summary'>
            <span>{ market.lastPrice * 100 }%</span>
          </div>
          <div className='details'>
            <p>Last price: <b>{ market.lastPrice }</b></p>
            <p className='alt'>Volume: <b>{ market.volume }</b></p>
            <p>Fee: <b>{ market.fee }</b></p>
            <p className='alt'>Author: <b>{ market.author }</b></p>
            <p>End date: <b>{ market.endDate || '-' }</b></p>
          </div>
        </div>
      );
    });
    return (
      <div className="markets">
        { marketList }
      </div>
    );
  }
});

var Markets = React.createClass({

  mixins: [FluxMixin, StoreWatchMixin('market')],

  getStateFromFlux: function () {
    var flux = this.getFlux();
    var marketState = flux.store('market').getState();

    return {
      markets: marketState.markets
    }
  },

  render: function () {
    return (
      <div>
        <h4 className="clearfix">Markets <a href="#add-market-modal" data-toggle="modal" className="pull-right">Submit a market</a></h4>
        <MarketList data={ this.state.markets } />
      </div>
    );
  }

});

module.exports = Markets;
