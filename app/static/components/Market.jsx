var _ = require('lodash');
var React = require('react');
var Fluxxor = require("fluxxor");
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var Identicon = require('../identicon.js');
var utilities = require('../utilities');

var Market = React.createClass({

  mixins: [FluxMixin, StoreWatchMixin('market')],

  getStateFromFlux: function () {

    var flux = this.getFlux();
    var marketState = flux.store('market').getState();
    var accountState = flux.store('account').getState();

    return {
      market: marketState.markets[1],
      account: accountState.account
    }
  },

  componentDidMount: function() {

    // build chart
    var data = google.visualization.arrayToDataTable([['Date', 'Price']].concat(market.priceHistory));
    var options = {
        title: 'Price',
        legend: { position: 'none' },
        backgroundColor: '#f9f6ea',
        chartArea: {top: 10, width: "85%", height: "80%"}
    };

    var chart = new google.visualization.LineChart(document.getElementById('market-chart'));
    chart.draw(data, options);

    // redraw on window resize
    $( window ).resize(function() { this.chart.draw(data, options); });
  },

  render: function() {

    var lastPrice = this.state.market.priceHistory[this.state.market.priceHistory.length-1][1];

    return (
      <div>
        <h3>
          <div className="current">{ parseInt(lastPrice * 100).toString() + '%' }</div>
          <div className="text">{ this.state.market.text }</div>
        </h3>
        <div className="row summary">
          <div className="col-xs-4 trade">
            <p className="delta">-</p>
            <p className="shares-held">Shares held: <b>{ this.state.market.sharesHeld[0] || '-' }</b></p>
            <p className="end-date">End date: <b>-</b></p>
            <div className="input-group buy yes">
              <input type="text" className="form-control" placeholder="Shares" />
              <span className="input-group-btn">
                <button className="btn btn-success" type="button">Buy <b></b></button>
              </span>
            </div>
            <div className="input-group buy no">
              <input type="text" className="form-control" placeholder="Shares" />
              <span className="input-group-btn">
                <button className="btn btn-danger" type="button">Sell <b></b></button>
              </span>
            </div>
          </div>
          <div className="col-xs-8">
            <div id="market-chart" className="chart"></div>
            <div className="details">
              <p className="current-price">Current price:<b></b></p>
              <p className="cash">Cash available:<b className="cash-balance">-</b></p>
              <p className="cost">Cost of trade:<b>-</b></p>
              <p className="new-cash">New cash available:<b>-</b></p>
              <p className="new-price">New price:<b>-</b></p>
              <p className="author">-</p>
            </div>
          </div>
        </div>

        <h4>{ this.state.market.comments.length } Comments</h4>
        <Comments comments={ this.state.market.comments } account={ this.state.account } />

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

module.exports = Market;
