var _ = require('lodash');
var React = require('react');
var Fluxxor = require('fluxxor');
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var Router = require("react-router");
var RouteHandler = Router.RouteHandler;

var Identicon = require('../libs/identicon.js');
var utilities = require('../libs/utilities');

var NO = 1;
var YES = 2;

var Router = React.createClass({

  mixins: [FluxMixin, StoreWatchMixin('market')],

  getStateFromFlux: function () {

    var flux = this.getFlux();
    var marketState = flux.store('market').getState();
    var account = flux.store('network').getAccount();

    var marketId = new BigNumber(this.props.params.marketId, 64);

    return {
      market: marketState.markets[marketId],
      account: account
    }
  },

  render: function() {
    var outcomes;
    if (_.isUndefined(this.state.market)) {
      outcomes = [];
    } else {
      var outcomeCount = this.state.market.outcomes.length;
      var outcomes = _.map(this.state.market.outcomes, function (outcome) {
        return (
          <Outcome {...outcome} outcomeCount={outcomeCount}></Outcome>
        );
      });
    }

    return (
      <div id='market'>
        <h3>{ this.state.market.description }</h3>
        <p className="info">Augur reporters will resolve this question after January 20, 2017.</p>
        <RouteHandler {...this.props} {...this.state} />
      </div>
    );
  }
});

var Overview = React.createClass({
  render: function() {
    var outcomes;
    if (_.isUndefined(this.props.market)) {
      outcomes = [];
    } else {
      var outcomeCount = this.props.market.outcomes.length;
      var outcomes = _.map(this.props.market.outcomes, function (outcome) {
        return (
          <Outcome {...outcome} outcomeCount={outcomeCount}></Outcome>
        );
      });
    }

    return (
      <div>
        { outcomes }
        <h4>{ this.props.market.comments.length } Comments</h4>
        <Comments comments={ this.props.market.comments } account={ this.props.account } />
      </div>
    );
  }
});

var Outcome = React.createClass({

  getOutcomeName: function () {
    if (this.props.outcomeCount != 2) {
      return this.props.id;
    }

    if (this.props.id === NO) {
      return 'No';
    } else {
      return 'Yes';
    }
  },

  render: function () {
    return (
      <div className="outcome outcome-{ this.props.id } col-md-6">
        <h3>{ this.getOutcomeName() }</h3>
        <div className="price">{ (Math.floor(this.props.price) * 100).toString() }%</div>
        <p className="shares-held">Shares held: 0</p>
        <button className="btn btn-success" type="button">Buy</button>
        <button className="btn btn-warning" type="button">Sell</button>
      </div>
    );
  }
});

var Comments = React.createClass({

  render: function() {
    return (
      <div id="comments">
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
            <div className="date">{ utilities.formatDate(c.date) }</div>
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
          <input type="textarea" className="form-control" placeholder="Join the discussion..." />
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
