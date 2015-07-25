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

class MarketPane extends React.Component {

  constructor(props) {
    super(props);

    this.relevantMarketAttrs = ['outstandingShares', 'tradingPeriod', 'endDate', 'price', 'tradingFee'];
    this.lastMarket = {};
  }

  shouldComponentUpdate(nextProps, nextState) {
    
    for (let attr of this.relevantMarketAttrs) {
      if (this.lastMarket[attr] != nextProps.market[attr])
        return true;
    }
    return Boolean(this.props.currentBranch != nextProps.currentBranch ||
      (nextProps.currentBranch &&
       this.props.currentBranch.currentPeriod != nextProps.currentBranch.currentPeriod));
  }

  render() {

    var market = this.props.market;
    var matured = this.props.currentBranch && this.props.currentBranch.currentPeriod >= this.props.market.tradingPeriod;
    var outstandingShares =_.reduce(market.outcomes, function(outstandingShares, outcome) {
      if (outcome) return outstandingShares + parseFloat(outcome.outstandingShares);
    }, 0);

    var formattedDate = market.endDate ? moment(market.endDate).format('MMM Do, YYYY') : '-';
    var price = market.price ? Math.abs(market.price).toFixed(3) : '-';
    var percent = market.price ? +market.price.times(100).toFixed(1) + '%' : ''
    var outstandingShares = outstandingShares ? +outstandingShares.toFixed(2) : '-';
    var tradingFee = market.tradingFee ? +market.tradingFee.times(100).toFixed(2)+'%' : '-';

    for (let attr of this.relevantMarketAttrs) {
      this.lastMarket[attr] = market[attr];
    }

    var status = '';
    var linked = true;
    var className = 'market-pane shadow';

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
    } else if (matured) {
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
          <p className='alt'>Outstanding Shares: <b>{ outstandingShares }</b></p>
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
}

module.exports = Markets;
