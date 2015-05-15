var _ = require('lodash');
var React = require('react');
var Fluxxor = require('fluxxor');
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var ReactBootstrap = require('react-bootstrap');
var Modal = ReactBootstrap.Modal;
var Router = require("react-router");
var RouteHandler = Router.RouteHandler;

var Identicon = require('../libs/identicon');
var utilities = require('../libs/utilities');
var momemt = require('moment');
var Outcomes = require('./Outcomes');

var Router = React.createClass({

  mixins: [FluxMixin, StoreWatchMixin('market', 'asset')],

  getStateFromFlux: function () {

    var flux = this.getFlux();
    var marketState = flux.store('market').getState();
    var account = flux.store('network').getAccount();
    var assetState = flux.store('asset').getState();
    var votePeriod = flux.store('branch').getState().currentVotePeriod;

    var marketId = new BigNumber(this.props.params.marketId, 16);
    var market = marketState.markets[marketId];
    if (market) market.matured = votePeriod && votePeriod.toNumber() > market.tradingPeriod.toNumber() ? true : false;

    return {
      market: market,
      cashBalance: assetState.cashBalance,
      account: account
    }
  },

  render: function() {

    // return nothing until we have an actual market loaded
    if (_.isUndefined(this.state.market)) return (<div />);

    var market = this.state.market;

    var subheading = '';
    if (market.endDate) {
      if (market.matured) {
        subheading = 'Matured on ' + market.endDate.format("MMMM Do, YYYY");
      } else {
        subheading = 'Resolves after ' + market.endDate.format("MMMM Do, YYYY");
      }
    }

    var formattedDate = market.endDate ? moment(market.endDate).format('MMM Do, YYYY') : '-';
    var price = market.price ? +market.price.toFixed(3) : '-';
    var percent = market.price ? +market.price.times(100).toFixed(1) + '%' : ''
    var volume = market.totalVolume ? +market.totalVolume.toFixed(2) : '-';
    var tradingFee = market.tradingFee ? +market.tradingFee.times(100).toFixed(2)+'%' : '-';
    var traderCount = market.traderCount ? +market.traderCount.toNumber() : '-';

    return (
      <div id='market'>
        <h3>{ market.description }</h3>
        <div className="subheading">{ subheading }</div>
        <RouteHandler {...this.props} {...this.state} />
        <div className='details col-sm-4'>
          <p>Price: <b>{ price }</b></p>
          <p className='alt'>Volume: <b>{ volume }</b></p>
          <p>Fee: <b>{ tradingFee }</b></p>
          <p className='alt'>Traders: <b>{ traderCount }</b></p>
          <p>Author: <b className='truncate author'>{ market.author || '' }</b></p>
          <p className='alt'>End date: <b>{ formattedDate }</b></p>
        </div>
        <div className='price-history col-sm-8'>
          <h4>Price history soon...</h4>
        </div>
        <div className='row'>
          <div className='col-xs-12'>
            <Comments comments={ market.comments } account={ this.state.account } />
          </div>
        </div>
      </div>
    );
  }
});

var Overview = React.createClass({

  render: function() {

    // return nothing until we have an actual market loaded
    if (_.isUndefined(this.props.market)) return (<div />);

    var outcomeCount = this.props.market.outcomes.length;
    var matured = this.props.market.matured;
    var params = this.props.params;
    var outcomes = _.map(this.props.market.outcomes, function (outcome) {
      return (
        <div className="col-sm-6">
          <Outcomes.Overview key={ outcome.id } {...outcome} matured={matured} outcomeCount={outcomeCount} params={params}></Outcomes.Overview>
        </div>
      );
    });

    return ( 
      <div className='row'>
        { outcomes } 
      </div>
    );
  }
});

var Comments = React.createClass({

  render: function() {

    // return nothing until we have an account
    if (!this.props.account) return (<div />);

    return (
      <div className="comments">
        <h4>{ this.props.comments.length } Comments</h4>
        <CommentForm account={ this.props.account }/>
        <CommentList comments={ this.props.comments } />
      </div>
    );
  }
});

var CommentList = React.createClass({

  render: function() {

    var commentList = _.map(this.props.comments, function (c) {

      var identicon = 'data:image/png;base64,' + new Identicon(c.author, 50).toString();

      return (
        <div className="comment">
          <div className="user avatar" style={{ backgroundImage: 'url(' + identicon + ')' }}></div>
          <div className="box">
            <p>{ c.comment }</p>
            <div className="date">{ c.date }</div>
            <div className="address">{ c.author }</div>
          </div>
        </div>
      );
    });

    return (
      <div>
        { commentList }
      </div>
    );
  }
});

var CommentForm = React.createClass({

  render: function() {

    var userIdenticon = 'data:image/png;base64,' + new Identicon(this.props.account, 50).toString();

    return (
      <form className="comment">
        <div className="user avatar" style={{ backgroundImage: 'url(' + userIdenticon + ')' }}></div>
        <div className="box">
          <input type="textarea" className="form-control" placeholder="Also coming soon..." />
          <div className="user address"></div>
        </div>
      </form>
    );
  }
});

module.exports = {
  Overview: Overview,
  Router: Router
};
