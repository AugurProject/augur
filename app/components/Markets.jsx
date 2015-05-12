var _ = require('lodash');
var React = require('react');
var Fluxxor = require("fluxxor");
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var moment = require('moment');
var Router = require('react-router');
var Link = Router.Link;

var Markets = React.createClass({

  render: function() {

    //console.log(this.props.votePeriod);
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
    var formattedDate = market.endDate ? moment(market.endDate).format('MMM Do, YYYY') : '-'

    if (market.pending) {
      return (
        <div className='market-pane pending shadow'>
          <h5>{ market.description }</h5>
          <div className='summary'>
            <i className='pull-right'>Pending</i>
          </div>
          <div className='details'>
            <p>Price: <b>-</b></p>
            <p className='alt'>Volume: <b>-</b></p>
            <p>Fee: <b>-</b></p>
            <p className='alt'>End date: <b>-</b></p>
          </div>
        </div>
      );
    } else {

      var matured = '';
      var className = 'market-pane shadow'
      if (this.props.votePeriod && this.props.votePeriod.toNumber() > market.tradingPeriod.toNumber()) {
        matured = 'Matured';
        className += ' matured';
      }

      return (
        <Link to='market' params={ {marketId: market.id.toString(16)} } className={ className }>
          <h5>{ market.description }</h5>
          <div className='summary clearfix'>
            <span>{ +market.price.times(100).toFixed(1) }%</span>
            <i className='pull-right'>{ matured }</i>
          </div>
          <div className='details'>
            <p>Price: <b>{ +market.price.toFixed(3) }</b></p>
            <p className='alt'>Volume: <b>{ +market.totalVolume.toFixed(2) }</b></p>
            <p>Fee: <b>{ +market.tradingFee.times(100).toFixed(3) }%</b></p>
            <p className='alt'>End date: <b>{ formattedDate }</b></p>
          </div>
        </Link>
      );
    }
  }
});

module.exports = Markets;
