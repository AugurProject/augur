var _ = require('lodash');
var abi = require('augur-abi');
var React = require('react');
var Fluxxor = require('fluxxor');
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var ReactBootstrap = require('react-bootstrap');
var Button = ReactBootstrap.Button;
var ButtonGroup = ReactBootstrap.ButtonGroup;
var Modal = ReactBootstrap.Modal;
var Router = require("react-router");
var State = Router.State;
var RouteHandler = Router.RouteHandler;
var Highstock = require('react-highcharts/highstock');

var Identicon = require('../libs/identicon');
var utilities = require('../libs/utilities');
var moment = require('moment');
var Outcomes = require('./Outcomes');

var Market = React.createClass({

  mixins: [FluxMixin, StoreWatchMixin('market', 'asset', 'branch', 'config')],

  getStateFromFlux: function () {
    var flux = this.getFlux();

    var account = flux.store('config').getAccount();
    var handle = flux.store('config').getHandle();
    var assetState = flux.store('asset').getState();
    var currentBranch = flux.store('branch').getCurrentBranch();
    var marketId = new BigNumber(this.props.params.marketId, 16);
    var market = flux.store('market').getMarket(marketId);

    if (currentBranch && market && market.tradingPeriod &&
        currentBranch.currentPeriod >= market.tradingPeriod.toNumber())
    {
      market.matured = true;
    }

    return {
      currentBranch: currentBranch,
      market: market,
      comments: (market && market.comments) ? market.comments : null,
      cashBalance: assetState.cashBalance,
      account: account,
      handle: handle,
      blockNumber: flux.store('network').getState().blockNumber,
      commentFilter: (market && market.id) ? augur.comments.initComments(abi.hex(market.id)) : null
    };
  },

  render: function () {

    // return nothing until we have an actual market loaded
    if (_.isUndefined(this.state.market) || (this.state.market && !this.state.market.loaded) ) return (<div />);

    var market = this.state.market;

    // TODO move this data juggling stuff to marketeer
    var numPoints = {
      yes: market.priceHistory[2].length,
      no: market.priceHistory[1].length
    };
    var data = {
      yes: new Array(numPoints.yes),
      no: new Array(numPoints.no)
    };
    var block = this.state.blockNumber;
    for (var i = 0; i < numPoints.yes; ++i) {
      data.yes[i] = [
        utilities.blockToDate(market.priceHistory[2][i].blockNumber, block).unix() * 1000,
        Number(market.priceHistory[2][i].price)
      ];
    }
    for (i = 0; i < numPoints.no; ++i) {
      data.no[i] = [
        utilities.blockToDate(market.priceHistory[1][i].blockNumber, block).unix() * 1000,
        Number(market.priceHistory[1][i].price)
      ];
    }
    var seriesOptions = [
      { name: "Yes", data: data.yes, color: "#4422CE" },
      { name: "No", data: data.no, color: "#D00030" }
    ];
    var config = {
      chart: {
        renderTo: "highstock",
        height: 250,
        marginRight: 22,
        marginBottom: 10,
        reflow: true
      },
      legend: {
        enabled: true,
        align: 'right',
        backgroundColor: '#FCFFC5',
        borderColor: 'black',
        borderWidth: 2,
        layout: 'horizontal',
        verticalAlign: 'top',
        y: 100,
        shadow: true
      },
      rangeSelector: { selected: 1 },
      yAxis: {
        title: {
          text: 'price'
        },
        min: 0,
        max: 1,
        plotLines: [{
          value: 0,
          width: 1,
          color: '#808080'
        }]
      },
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle',
        borderWidth: 0
      },
      tooltip: {
        pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
        valueDecimals: 2
      },
      series: seriesOptions
    };

    var subheading = '';
    if (market.endDate) {
      if (market.matured) {
        subheading = 'Matured on ' + market.endDate.format("MMMM Do, YYYY");
      } else if (market.endDate) {
        subheading = 'Resolves after ' + market.endDate.format("MMMM Do, YYYY");
      } else {
        subheading = 'Loading...';
      }
    }
    var outstandingShares =_.reduce(market.outcomes, function(outstandingShares, outcome) {
      if (outcome) return outstandingShares + parseFloat(outcome.outstandingShares);
    }, 0);

    var formattedDate = market.endDate ? moment(market.endDate).format('MMM Do, YYYY') : '-';
    var formattedCreationDate = market.creationDate ? moment(market.creationDate).format('MMM Do, YYYY') : '-';
    var price = market.price ? Math.abs(market.price).toFixed(3) : '-';
    var percent = market.price ? +market.price.times(100).toFixed(1) + '%' : '';
    var outstandingShares = outstandingShares ? +outstandingShares.toFixed(2) : '-';
    var tradingFee = market.tradingFee ? +market.tradingFee.times(100).toFixed(2)+'%' : '-';
    var traderCount = market.traderCount ? +market.traderCount.toNumber() : '-';
    var author = market.author ? abi.hex(market.author) : '-';

    var outcomes = _.map(this.state.market.outcomes, function (outcome) {
      return (
        <div className="col-sm-6" key={ outcome.id }>
          <Outcomes.Overview market={ this.state.market } outcome={ _.clone(outcome) } account={ this.state.account } />
        </div>
      );
    }, this);

    return (
      <div id='market'>
        <h3>{ market.description }</h3>
        <div className="subheading clearfix">
          <span className="pull-left">{ subheading }</span> 
          <Twitter marketName={ market.description } pathname={ this.getPathname } />
        </div>
        <div className='row'>
          { outcomes } 
        </div>
        <div className='details col-sm-4'>
          <p>Price: <b>{ price }</b></p>
          <p className='alt'>Outstanding shares: <b>{ outstandingShares }</b></p>
          <p>Fee: <b>{ tradingFee }</b></p>
          <p className='alt'>Traders: <b>{ traderCount }</b></p>
          <p>Author: <b className='truncate author'>{ author }</b></p>
          <p className='alt'>Creation date: <b>{ formattedCreationDate }</b></p>
          <p>End date: <b>{ formattedDate }</b></p>
        </div>
        <div className='price-history col-sm-8'>
          <Highstock id="highchart" className='price-chart' config={ config }></Highstock>
        </div>
        <div className='row'>
          <div className='col-xs-12'>
            <Comments comments={ this.state.comments } account={ this.state.account } handle={ this.state.handle } market={ this.state.market } />
          </div>
        </div>
      </div>
    );
  }
});

class Twitter extends React.Component {

  componentDidMount() {

    // load twitter widget js
    !function(d,s,id){
      var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';
      if(!d.getElementById(id)){
        js=d.createElement(s);
        js.id=id;
        js.src=p+'://platform.twitter.com/widgets.js';
        fjs.parentNode.insertBefore(js,fjs);
      }
    }(document, 'script', 'twitter-wjs');
  }

  render() {

    let tweetText = this.props.marketName;
    let tweetUrl = 'http://client.augur.net' + this.props.pathname;

    return (
      <div className="twitter-share-block pull-right">
        <a href="https://twitter.com/share" className="twitter-share-button" data-count='none' data-url={ tweetUrl } data-text={ tweetText } data-via="AugurProject"></a>
      </div>
    )
  }
}

var Comments = React.createClass({

  mixins: [FluxMixin],

  componentDidMount: function () {
    if (this.props.market && this.props.market.id) {
      this.getFlux().actions.market.loadComments(this.props.market);
    }
  },

  render: function () {
    return (
      <div className="comments">
        <h4>{ this.props.comments.length } Comments</h4>
        <div>
          <CommentForm account={ this.props.account } handle={ this.props.handle } marketId={ this.props.market.id } />
          <CommentList comments={ this.props.comments } />
        </div>
      </div>
    );
  }
});

var CommentList = React.createClass({
  /**
   * comment format:
   * [ { whisperId: '0x04aec3e929a511be478cab0de7...',
   *     from: '0x639b41c4d3d399894f2a57894278e1653e7cd24c',
   *     comment: 'o3g50msfpnl8fr',
   *     time: 1442272587 },
   *   { whisperId: '0x04d2f7b8e6fa3a4ba00f988091...',
   *     from: '0x639b41c4d3d399894f2a57894278e1653e7cd24c',
   *     comment: 'lgn7ch1sdzpvi',
   *     time: 1442272586 }, ... ]
   */
  render: function () {
    var commentList = _.map(this.props.comments, function (c) {

      var identicon = 'data:image/png;base64,' + new Identicon(c.from, 50).toString();
      var commentId = c.whisperId + c.time.toString();
      var author = (c.handle) ? c.handle + " | " + c.from : c.from;

      return (
        <div className="comment" key={ commentId }>
          <div className="user avatar" style={{ backgroundImage: 'url(' + identicon + ')' }}></div>
          <div className="box">
            <p>{ c.comment }</p>
            <div className="date">{ moment(c.time * 1000).fromNow() }</div>
            <div className="address">{ author }</div>
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

  mixins: [FluxMixin],

  submitComment: function (event) {
    var commentText = document.getElementById("comment-text").value;
    $("#comment-text").val('');
    this.getFlux().actions.market.addComment(commentText, this.props.marketId, {
      address: this.props.account,
      handle: this.props.handle
    });
  },

  render: function () {

    if (!this.props.account) return ( <span /> );
    
    var userIdenticon = 'data:image/png;base64,' + new Identicon(this.props.account, 50).toString();

    return (
      <form className="comment">
        <div className="user avatar" style={{ backgroundImage: 'url(' + userIdenticon + ')' }}></div>
        <div className="box">
          <input type="textarea" className="form-control" id="comment-text" placeholder="Enter comments here" />
          <div className="user address"></div>
          <ButtonGroup className='pull-right send-button'>
            <Button bsStyle='default' bsSize='xsmall' onClick={ this.submitComment }>Babble</Button>
          </ButtonGroup>
        </div>
      </form>
    );
  }
});

module.exports = Market;
