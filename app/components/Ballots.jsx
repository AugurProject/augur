var React = require('react');
var Fluxxor = require("fluxxor");
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var ReactBootstrap = require('react-bootstrap');
var Button = ReactBootstrap.Button;
var utilities = require('../libs/utilities');

var Ballots = React.createClass({

  mixins: [FluxMixin, StoreWatchMixin('asset', 'branch', 'config')],

  getInitialState: function () {
    return {
    };
  },

  getStateFromFlux: function () {
    var flux = this.getFlux();
    var account = flux.store('network').getAccount();

    return {
      account: account,
      asset: flux.store('asset').getState(),
      ethereumClient: flux.store('config').getEthereumClient(),
      branchState: flux.store('branch').getState()
    }
  },

  render: function () {

    var currentBranch = this.state.branchState.currentBranch;

    var periodDateRange = '';
    if (currentBranch.currentPeriod) {
      var endBlock = currentBranch.currentPeriod * currentBranch.periodLength;
      var periodEndMoment = utilities.blockToDate(endBlock);
      var startBlock = (currentBranch.currentPeriod - 1) * currentBranch.periodLength;
      var periodStartMoment = utilities.blockToDate(startBlock);
      periodDateRange = periodStartMoment.format('MMM Do, HH:MM') + ' - ' + periodEndMoment.format('MMM Do, HH:MM'); 
    }

    var ballotList = _.map(_.sortBy(this.props.events, 'expirationBlock'), function (event) {
      return (
        <div key={ event.id } className={ this.props.classNameWrapper }>
          <Ballot event={ event } {...this.props} />
        </div>
      );
    }, this);

    return (
      <div id="ballots">
        <h3>Ballots</h3>
        <div className='subheading clearfix'>
          Period { currentBranch.currentPeriod } 
          <span className='pull-right'>{ periodDateRange }</span>
        </div>
        <div className='row'>
          { ballotList }
        </div>
      </div>
    );
  }
});

var Ballot = React.createClass({

  render: function() {

  }

});

module.exports = Ballots;
