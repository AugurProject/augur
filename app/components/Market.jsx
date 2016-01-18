var BigNumber = require("bignumber.js");
var _ = require("lodash");
var abi = require("augur-abi");
var React = require("react");
var Fluxxor = require("fluxxor");
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var ReactBootstrap = require("react-bootstrap");
var Button = ReactBootstrap.Button;
var ButtonGroup = ReactBootstrap.ButtonGroup;
var Modal = ReactBootstrap.Modal;
var Router = require("react-router");
var State = Router.State;
var RouteHandler = Router.RouteHandler;
var Highstock = require("react-highcharts/bundle/highstock");

var Identicon = require("../libs/identicon");
var utilities = require("../libs/utilities");
var moment = require("moment");
var Outcomes = require("./Outcomes");

var NO = 1;
var YES = 2;

// this method was missing for some time and nobody noticed, so maybe it's not that important
var priceToPercentage = function (price) {
  if (price) {
    return +price.times(100).toFixed(1);
  } else {
    return 0;
  }
};


var getOutcomeName = function (id, market) {
  switch (market.type) {
  case "categorical":
    if (market && market.description && market.description.indexOf("Choices:") > -1) {
      var desc = market.description.split("Choices:");
      try {
        return {
          type: "categorical",
          outcome: desc[desc.length - 1].split(",")[id - 1].trim()
        };
      } catch (exc) {
        console.error("categorical parse error:", market.description, exc);
      }
    }
    return {
      type: "categorical",
      outcome: id
    };
    break;
  case "scalar":
    if (id === NO) return {type: "scalar", outcome: "⇩"};
    return {type: "scalar", outcome: "⇧"};
    break;
  case "binary":
    if (id === NO) return {type: "binary", outcome: "No"};
    return {type: "binary", outcome: "Yes"};
  default:
    console.error("unknown type:", market);
  }
};

var Market = React.createClass({

  mixins: [FluxMixin, StoreWatchMixin('market', 'asset', 'branch', 'config')],

  getInitialState: function() {
    return {
      fullAuthor: false
    }
  },

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
      blockNumber: flux.store('network').getState().blockNumber
    };
  },

  showFullAuthor: function() {
    this.setState({fullAuthor: true});
  },

  truncateAuthor: function() {
    this.setState({fullAuthor: false});
  },

  render: function () {

    // return nothing until we have an actual market loaded
    if (_.isUndefined(this.state.market) || (this.state.market && !this.state.market.loaded) ) return (<div />);

    var market = this.state.market;

    var numPoints = {yes: 0, no: 0};
    if (market.priceHistory) {
      if (market.priceHistory[2] && market.priceHistory[2].length) {
        numPoints.yes = market.priceHistory[2].length;
      }
      if (market.priceHistory[1] && market.priceHistory[1].length) {
        numPoints.no = market.priceHistory[1].length;
      }
    }
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

    if (this.state.market.type === "combinatorial") {
      var events = this.state.market.events;
      var outcomes = [];
      for (var i = 0, n = this.state.market.numEvents; i < n; ++i) {
        var eventSubheading = "";
        if (events[i].endDate) {
          eventSubheading = "Resolves after " + events[i].endDate.format("MMMM Do, YYYY");
        } else {
          eventSubheading = "Loading...";
        }
        var outcome = [];
        for (var j = 0, m = this.state.market.numOutcomes; j < m; ++j) {
          // Event A
          // [ ] Yes       [ ] No
          // Event B
          // [ ] Yes       [ ] No
          var outcomeName = getOutcomeName(this.state.market.outcomes[j].id, events[i]);
          var metalClass = (outcomeName.type === "categorical") ? "metal-categorical" : "";
          var displayPrice;
          if (events[i].type === "scalar") {
            displayPrice = +this.state.market.outcomes[j].price.toFixed(2);
          } else {
            displayPrice = priceToPercentage(this.state.market.outcomes[j].price) + "%";
          }
          outcome.push(
            <div className="col-sm-4" key={this.state.market._id+this.state.market.outcomes[j].id}>
              <h4 className={"metal " + metalClass}>
                <div className={outcomeName.type + " name"}>{outcomeName.outcome}</div>
                <div className="price">{displayPrice}</div>
              </h4>
              <div className="summary">
                <div className='buy trade-button'>
                  <Button bsStyle='success'>Yes Plz</Button>
                </div>
                <p>{ Math.abs(this.state.market.outcomes[j].price).toFixed(4) } cash/share</p>
                <p>{ +this.state.market.outcomes[j].outstandingShares.toFixed(2) } shares outstanding</p>
              </div>
            </div>
          );
        }
        outcomes.push(
          <div className="col-sm-12" key={events[i].id}>
            <h3 className="event-description">{events[i].description}</h3>
            <div className="subheading clearfix">
              <span className="pull-left event-subheading">{eventSubheading}</span>
            </div>
            <div className="row event-outcomes">{outcome}</div>
          </div>
        );
      }
    } else {
      var outcomes = _.map(this.state.market.outcomes, function (outcome) {
        return (
          <div className="col-sm-6" key={outcome.id}>
            <Outcomes.Overview
              market={this.state.market}
              outcome={_.clone(outcome)}
              account={this.state.account} />
          </div>
        );
      }, this);
    }

    return (
      <div id='market'>
        <h3>{ market.description }</h3>
        <div className="subheading clearfix">
          <span className="pull-left">{subheading}</span> 
          <Twitter marketName={market.description} pathname={this.getPathname} />
        </div>
        <div className='row'>
          { outcomes } 
        </div>
        <div className='details col-sm-4'>
          <p>Price: <b>{ price }</b></p>
          <p className='alt'>Outstanding shares: <b>{ outstandingShares }</b></p>
          <p>Fee: <b>{ tradingFee }</b></p>
          <p className='alt'>Traders: <b>{ traderCount }</b></p>
          <p onMouseEnter={this.showFullAuthor} onMouseLeave={this.truncateAuthor}>Author: <b className={this.state.fullAuthor ? 'no-truncate author-full' : 'truncate author'}>{ abi.format_address(author) }</b></p>
          <p className='alt'>Creation date: <b>{ formattedCreationDate }</b></p>
          <p>End date: <b>{ formattedDate }</b></p>
        </div>
        <div className='price-history col-sm-8'>
          <Highstock
            id="highchart"
            className='price-chart'
            config={config}>
          </Highstock>
        </div>
        <div className='row'>
          <div className='col-xs-12'>
            <Comments
              comments={this.state.comments}
              account={this.state.account}
              handle={this.state.handle}
              market={this.state.market} />
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
    let tweetUrl = 'http://app.augur.net' + this.props.pathname;

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
      this.getFlux().augur.actions.market.loadComments(this.props.market);
    }
  },

  render: function () {
    var numComments = (this.props.comments) ? this.props.comments.length : 0;
    return (
      <div className="comments">
        <h4>{ numComments } Comments</h4>
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
   * [{ ipfsHash: 'QmZGraGmtwejgHAWcLVfre86Q4Z3MfVBVFEw6Qm7L1PaKC',
   *    author: '0x05ae1d0ca6206c6168b42efcd1fbe0ed144e821b',
   *    message: 'why hello!',
   *    blockNumber: '0x95c6' }, ... ]
   */
  render: function () {
    var commentList = _.map(this.props.comments, function (c) {

      var identicon = 'data:image/png;base64,' + new Identicon(c.author, 50).toString();

      return (
        <div className="comment" key={ c.ipfsHash || c.time.toString() + c.author }>
          <div className="user avatar" style={{ backgroundImage: 'url(' + identicon + ')' }}></div>
          <div className="box">
            <p>{ c.message }</p>
            <div className="date">{ moment(c.time * 1000).fromNow() }</div>
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

  mixins: [FluxMixin],

  submitComment: function (event) {
    event.preventDefault();
    var element = document.getElementById("comment-text");
    var commentText = element.value;
    element.value = "";
    this.getFlux().actions.market.addComment(commentText, this.props.marketId, {
      address: this.props.account,
      handle: this.props.handle
    });
  },

  render: function () {
    if (!this.props.account) return ( <span /> );
    var icon = 'data:image/png;base64,' + new Identicon(this.props.account, 50).toString();
    return (
      <form className="comment" onSubmit={this.submitComment}>
        <div
          className="user avatar"
          style={{backgroundImage: 'url(' + icon + ')'}}>
        </div>
        <div className="box">
          <input
            type="textarea"
            className="form-control"
            id="comment-text"
            placeholder="Enter comments here" />
          <div className="user address"></div>
          <ButtonGroup className="pull-right send-button">
            <Button
              type="submit"
              bsStyle="default"
              bsSize="xsmall"
              onClick={this.submitComment}>
              Babble
            </Button>
          </ButtonGroup>
        </div>
      </form>
    );
  }
});

module.exports = Market;
