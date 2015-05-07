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

  mixins: [FluxMixin, StoreWatchMixin('market')],

  getStateFromFlux: function () {

    var flux = this.getFlux();
    var marketState = flux.store('market').getState();
    var account = flux.store('network').getAccount();
    var assetState = flux.store('asset').getState();

    var marketId = new BigNumber(this.props.params.marketId, 16);

    return {
      market: marketState.markets[marketId],
      cashBalance: assetState.cashBalance,
      account: account
    }
  },

  render: function() {

    // return nothing until we have an actual market loaded
    if (_.isUndefined(this.state.market)) return (<div />);

    return (
      <div id='market'>
        <h3>{ this.state.market.description }</h3>
        <div className="subheading">Resolves after { this.state.market.endDate.format("MMMM Do, YYYY") }</div>
        <div className="row">
          <div className='col-sm-6'>
            <RouteHandler {...this.props} {...this.state} />
          </div>
          <div className='col-sm-6'>
            <div className='price-history'>
              <h4>Price history soon...</h4>
            </div>
          </div>
        </div>
        <Comments comments={ this.props.market.comments } account={ this.props.account } />
      </div>
    );
  }
});

var Overview = React.createClass({

  render: function() {

    // return nothing until we have an actual market loaded
    if (_.isUndefined(this.props.market)) return (<div />);

    var outcomeCount = this.props.market.outcomes.length;
    var params = this.props.params;
    var outcomes = _.map(this.props.market.outcomes, function (outcome) {
      return (
        <Outcomes.Overview {...outcome} outcomeCount={outcomeCount} params={params}></Outcomes.Overview>
      );
    });

    return ( 
      <div>
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
