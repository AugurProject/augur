var _ = require('lodash');
var React = require('react');
var Fluxxor = require('fluxxor');
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var utilities = require('../libs/utilities');

var Period = React.createClass({

  mixins: [FluxMixin, StoreWatchMixin('network')],

  getStateFromFlux: function () {

    var flux = this.getFlux();
    var networkSate = flux.store('network').getState();
    var branchState = flux.store('branch').getState();
    var currentBranchData = branchState.branches[branchState.currentBranch];

    console.log(branchState);
    // clean up current period
    var currentPeriod;
    if (currentBranchData.currentPeriod == -1) {
      currentPeriod = 0;
    } else {
      currentPeriod = currentBranchData.currentPeriod;
    }

    var periodStart = currentBranchData.periodLength * currentPeriod;
    var periodEnd = periodStart + currentBranchData.periodLength;
    var periodAt = currentBlock - periodStart;
    var periodPercent = (periodAt/ currentBranchData.periodLength) * 100;
    var periodEndDate = utilities.blockToDate(periodEnd, currentBlock);
    var formattedEndDate = utilities.formatDate(periodEndDate);

    return {
      blockNumber: networkState.blockNumber,
      percent: periodPercent,
      endDate: formattedEndDate
    }
  },

  render: function() {

    return (
      <div>
        <h3 className="clearfix"><span className="section-title"></span><span className="period-ending">Period ending { this.state.endDate }</span></h3>
        <div className="progress">
          <div className="progress-bar" role="progressbar" aria-valuenow="{ this.state.percent }" aria-valuemin="0" aria-valuemax="100" style="width: { this.state.percent }%;"></div>
        </div>
      </div>
    );
  }
});

module.exports = Period;
