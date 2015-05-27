var _ = require('lodash');
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

  mixins: [FluxMixin, StoreWatchMixin('asset', 'branch', 'config', 'event', 'report')],

  getInitialState: function () {
    return {
      decisions: {}
    };
  },

  getStateFromFlux: function () {
    var flux = this.getFlux();
    var account = flux.store('network').getAccount();
    var reportState = flux.store('report').getState();

    var state = {
      account: account,
      asset: flux.store('asset').getState(),
      ethereumClient: flux.store('config').getEthereumClient(),
      branchState: flux.store('branch').getState(),
      events: reportState.eventsToReport,
    };

    state.report = reportState.getReport(
      state.branchState.currentBranch.id,
      state.branchState.currentBranch.votePeriod
    );

    return state;
  },

  handleSubmitReport: function() {
    var orderedDecisions = _.map(this.state.events, e => this.state.decisions[e.id]);
    this.getFlux().actions.report.hashReport(
      this.state.branchState.currentBranch.id,
      this.state.branchState.currentBranch.votePeriod,
      orderedDecisions
    );

    // TODO: Make the storing of the decisions make the ballot go away.
  },

  handleChangeDecision: function (eventId, decision) {
    this.setState(function (previousState, currentProps) {
      var decisions = _.clone(previousState.decisions);
      decisions[eventId] = decision;
      return {
        decisions: decisions
      };
    });
  },

  render: function () {

    var currentBranch = this.state.branchState.currentBranch;

    if (!currentBranch) return (<div />);

    var periodStartDate = '';
    var periodEndDate = '';
    var percentComplete = 0;
    var votePercentComplete = 0;
    var revealPercentComplete = 0;

    if (currentBranch.currentPeriod) {

      var endBlock = (currentBranch.votePeriod + 1) * currentBranch.periodLength;
      var periodEndMoment = utilities.blockToDate(endBlock);
      var startBlock = (currentBranch.votePeriod) * currentBranch.periodLength;
      var periodStartMoment = utilities.blockToDate(startBlock);

      if (periodStartMoment.format('MMM Do') === periodEndMoment.format('MMM Do')) {
        periodStartDate = periodStartMoment.format('MMM Do, HH:MM');
        periodEndDate = periodEndMoment.format('HH:MM');
      } else {
        periodStartDate = periodStartMoment.format('MMM Do, HH:MM');
        periodEndDate = periodEndMoment.format('MMM Do, HH:MM');
      }

      if (currentBranch.isCurrent) {
        percentComplete = currentBranch.percentComplete;
        if (percentComplete >= 50) {
          votePercentComplete = 50;
          revealPercentComplete = percentComplete - 50;
        } else {
          votePercentComplete = percentComplete;
        }
      }
    }

    if (!this.state.events.length) {

      var ballot = (
        <div className='no-decisions'>
          <h4>No decisions require your attention</h4>
        </div>
      );
    } else if (this.state.report) {
      if (this.state.report.reported) {
        var ballot = (
          <div className='no-decisions'>
            <h4>Your ballot has been submitted.</h4>
          </div>
        );
      } else {
        var ballot = (
          <div className='no-decisions'>
            <h4>Your ballot hash has been submitted.</h4>
            <p>
              You need to run Augur between X and Y so it can submit your full ballot
              during the appropriate reporting phase.
            </p>
          </div>
        );
      }
    } else {

      // build ballot
      var decisionList = _.map(this.state.events, function (event) {
        return (
          <div key={ event.id } className="decision">
            <Decision
              event={ event }
              decision={ this.state.decisions[event.id] }
              onChange={ this.handleChangeDecision }
              {...this.props} />
          </div>
        );
      }, this);

      var allDecisions = _.map(this.state.events, (event) => {
        return this.state.decisions[event.id];
      });
      var isSubmitDisabled = _.any(allDecisions, _.isUndefined);
      var disabledProp = isSubmitDisabled ? {disabled: true} : {};

      var ballot = (
        <div className='ballot shadow clearfix'>
          { decisionList }
          <Button className='pull-right submit-ballot' bsStyle='primary' {...disabledProp} onClick={ this.handleSubmitReport }>Submit Ballot</Button>
        </div>
      );
    }

    var markerPosition = percentComplete+'%';
    return (
      <div id="ballots">
        <h3>Ballot<span className='subheading pull-right'>Period { currentBranch.votePeriod}</span></h3>
        <div className='now-marker' style={{marginLeft: markerPosition}}>&#9662;</div>
        <ProgressBar className='period-progress'r>
          <ProgressBar bsStyle='primary' now={ votePercentComplete } key={1} />
          <ProgressBar bsStyle='warning' now={ revealPercentComplete } key={2} />
        </ProgressBar>
        <div className='subheading clearfix'>
          { periodStartDate }
          <span className='pull-right'>{ periodEndDate }</span>
        </div>
        { ballot }
      </div>
    );
  }
});

var Decision = React.createClass({
  propTypes: {
    event: React.PropTypes.object.isRequired,
    decision: React.PropTypes.string,
    // onChange takes an event ID and a decision value as a float.
    onChange: React.PropTypes.func.isRequired
  },

  handleChange: function (event) {
    // The change event on radio buttons is fired only on the element that
    // becomes checked, which is what we want. We use number strings to
    // for the decision values to maintain precision. Augur.js converts them
    // to fixed point numbers for us.
    this.props.onChange(this.props.event.id, event.target.value);
  },

  render: function() {

    return (
      <div className='row'>
        <div className='col-xs-12'>
          <h4>{ this.props.event.description }</h4>
        </div>
        <div className='col-xs-12'>
          <div className="outcomes row">
            <div className='col-sm-3'>
              <Input
                name={ this.props.event.id }
                type="radio"
                value="0"
                label="No"
                checked={this.props.decision === "0"}
                onChange={this.handleChange} />
            </div>
            <div className='col-sm-6'>
              <Input
                name={ this.props.event.id }
                type="radio"
                value="0.5"
                label="Ambiguous / Indeterminate"
                checked={this.props.decision === "0.5"}
                onChange={this.handleChange} />
            </div>
            <div className='col-sm-3'>
              <Input
                name={ this.props.event.id }
                type="radio"
                value="1"
                label="Yes"
                checked={this.props.decision === "1"}
                onChange={this.handleChange} />
            </div>
          </div>
        </div>
      </div>
    );
  }

});

module.exports = Ballots;
