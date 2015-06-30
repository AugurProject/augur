var _ = require('lodash');
var React = require('react');
var Fluxxor = require("fluxxor");
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var moment = require('moment');
var Router = require('react-router');
var Link = Router.Link;

var CloseMarketTrigger = require('./CloseMarket').CloseMarketTrigger;

var Markets = React.createClass({

  render: function() {

    var marketList = _.map(_.sortBy(this.props.markets, 'pending'), function (market) {
      return (
        <div key={ market.id } className={ this.props.classNameWrapper }>
          <MarketPane market={ market } {...this.props} />
        </div>
      );
    }, this);

    return ( 
      <div>
        { marketList }
      </div>
    );
  }
});

var MarketPane = React.createClass({

  render: function() {

    var market = this.props.market;
    if (this.props.currentBranch && this.props.currentBranch.currentPeriod >= market.tradingPeriod) market.matured = true;

    var volume =_.reduce(market.outcomes, function(volume, outcome) {
      if (outcome) return volume + parseFloat(outcome.volume);
    }, 0);
    
    var formattedDate = market.endDate ? moment(market.endDate).format('MMM Do, YYYY') : '-';
    var price = market.price ? Math.abs(market.price).toFixed(3) : '-';
    var percent = market.price ? +market.price.times(100).toFixed(1) + '%' : ''
    var volume = volume ? +volume.toFixed(2) : '-';
    var tradingFee = market.tradingFee ? +market.tradingFee.times(100).toFixed(2)+'%' : '-';

    var status = '';
    var linked = true;
    var className = 'market-pane shadow'

    if (market.pending) {
      status = 'Pending'
      className += ' pending';
      linked = false;
    } else if (!market.loaded) {
      status = 'Loading'
      className += ' loading';
      linked = false;
    } else if (market.invalid) {
      status = 'Invalid'
      className += ' invalid'; 
      linked = false;
    } else if (market.matured) {
      status = 'Matured'
      className += ' matured';
    }

    var body = (
      <div>
        <h5>{ market.description }<div className='overlay' /></h5>
        <div className='summary clearfix'>
          <span>{ percent }</span>
          <i className='pull-right'>{ status }</i>
        </div>
        <div className='details'>
          <p>Price: <b>{ price }</b></p>
          <p className='alt'>Volume: <b>{ volume }</b></p>
          <p>Fee: <b>{ tradingFee }</b></p>
          <p className='alt'>End date: <b>{ formattedDate }</b></p>
        </div>
      </div>
    );

    if (linked) {
      if (market.expired && market.authored && !market.closed) {
        return (
          <div className='close-market'>
            <CloseMarketTrigger text='close market' params={ { marketId: market.id.toString(16), branchId: market.branchId.toString(16) } } />
            <Link to='market' params={ {marketId: market.id.toString(16) } } className={ className }>
              { body }
            </Link>
          </div>
        );
      } else {
        return (
          <Link to='market' params={ {marketId: market.id.toString(16) } } className={ className }>
            { body }
          </Link>
        );
      }
    } else {
      return (
        <div className={ className }>
          { body }
        </div>
      );
    }
  }
});

module.exports = Markets;
