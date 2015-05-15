var React = require('react');
var Fluxxor = require("fluxxor");
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var ReactBootstrap = require('react-bootstrap');
var Button = ReactBootstrap.Button;
var Input = ReactBootstrap.Input;
var ProgressBar = ReactBootstrap.ProgressBar;
var utilities = require('../libs/utilities');

var Ballots = React.createClass({

  mixins: [FluxMixin, StoreWatchMixin('asset', 'branch', 'config', 'event')],

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
      branchState: flux.store('branch').getState(),
      events: flux.store('branch').getState().ballots
    }
  },

  render: function () {

    var currentBranch = this.state.branchState.currentBranch;

    if (!currentBranch) return (<div />);

    var periodDateRange = '';
    var currentPeriod = '-';
    var percentComplete = 0;
    var percentStyle = 'primary';

    if (currentBranch.currentPeriod) {

      var endBlock = currentBranch.currentPeriod * currentBranch.periodLength;
      var periodEndMoment = utilities.blockToDate(endBlock);
      var startBlock = (currentBranch.currentPeriod - 1) * currentBranch.periodLength;
      var periodStartMoment = utilities.blockToDate(startBlock);

      if (periodStartMoment.format('MMM Do') === periodEndMoment.format('MMM Do')) {
        periodDateRange = periodStartMoment.format('MMM Do, HH:MM') + ' - ' + periodEndMoment.format('HH:MM');
      } else {
        periodDateRange = periodStartMoment.format('MMM Do, HH:MM') + ' - ' + periodEndMoment.format('MMM Do, HH:MM');
      }

      currentPeriod = parseInt(currentBranch.currentPeriod);

      if (currentBranch.votePeriod === (currentPeriod - 1)) {
        percentComplete = parseFloat( ((currentBranch.currentPeriod - currentPeriod) * 100).toFixed(3) );
      } else {
        percentComplete = 100;
        percentStyle = 'warning';
      }
    }

    var ballotList = _.map(this.state.events, function (event) {
      return (
        <div key={ event.id }>
          <Ballot event={ event } {...this.props} />
        </div>
      );
    }, this);

    return (
      <div id="ballots">
        <h3>Ballots</h3>
        <ProgressBar bsStyle={ percentStyle } now={ percentComplete } className='period-progress' />
        <div className='subheading clearfix'>
          Period { currentPeriod }
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

    return (
      <div className='col-xs-12'>
        <div className='ballot shadow'>
          <div className='row'>
            <div className='col-md-8 col-sm-7'>
              <h4>{ this.props.event.description }</h4>
            </div>
            <div className='col-md-4 col-sm-5'>
              <div className="outcomes">
                <Input name={ this.props.event.id } type="radio" ref="No" value="0" label="No" />
                <Input name={ this.props.event.id } type="radio" ref="Ambiguous / Indeterminate" value="0.5" label="Ambiguous / Indeterminate" />
                <Input name={ this.props.event.id } type="radio" ref="Yes" value="1" label="Yes" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

});

module.exports = Ballots;
