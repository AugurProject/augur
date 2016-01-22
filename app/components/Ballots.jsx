var _ = require("lodash");
var React = require("react");
let FluxMixin = require("fluxxor/lib/flux_mixin")(React);
let StoreWatchMixin = require("fluxxor/lib/store_watch_mixin");
let Button = require('react-bootstrap/lib/Button');
let Input = require('react-bootstrap/lib/Input');
let ProgressBar = require('react-bootstrap/lib/ProgressBar');
var utilities = require("../libs/utilities");

var Ballots = React.createClass({

  mixins: [FluxMixin, StoreWatchMixin('asset', 'branch', 'config', 'network', 'report')],

  getInitialState: function () {
    return {
      decisions: {}
    };
  },

  getStateFromFlux: function () {
    var flux = this.getFlux();

    var state = {
      account: flux.store('config').getAccount(),
      asset: flux.store('asset').getState(),
      blockNumber: flux.store('network').getState().blockNumber,
      branchState: flux.store('branch').getState(),
      events: flux.store('report').getState().eventsToReport
    };

    if (state.branchState.currentBranch) {
      state.report = flux.store('report').getReport(
        state.branchState.currentBranch.id,
        state.branchState.currentBranch.reportPeriod
      );
    }

    return state;
  },

  handleSubmitReport: function() {
    var orderedDecisions = _.map(this.state.events, e => this.state.decisions[e.id]);
    this.getFlux().actions.report.hashReport(
      this.state.branchState.currentBranch.id,
      this.state.branchState.currentBranch.reportPeriod,
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

    var percentComplete = 0;
    var votePercentComplete = 0;
    var revealPercentComplete = 0;
    var votingDeadlineSpan = '';

    if (currentBranch && currentBranch.currentPeriod) {

      var [publishStart, publishEnd] = this.getFlux().store('branch').getReportPublishDates(this.state.blockNumber);

      if (currentBranch.isCurrent) {
        percentComplete = currentBranch.percentComplete;
        if (percentComplete >= 50) {
          votePercentComplete = 50;
          revealPercentComplete = percentComplete - 50;
        } else {
          votePercentComplete = percentComplete;
        }
      }

    } else {

      return (<div />);
    }

    if (this.state.report) {
      if (this.state.report.reported) {
        var ballot = (
          <div className='ballot shadow clearfix'>
            <h4>Ballot { currentBranch.reportPeriod }<span className="pull-right">submitted</span></h4>
          </div>
        );
      } else {
        var ballot = (
          <div className='ballot shadow clearfix'>
            <h4>Ballot { currentBranch.reportPeriod }<span className="pull-right">saved</span></h4>
            <p>This ballot has been saved and will be submitted <b>{ publishStart.format('MMM Do HH:mm') } - { publishEnd.format('MMM Do HH:mm') }</b></p>
          </div>
        );
      }
    } else if (!(_.keys(this.state.events).length && percentComplete < 50)) {

      var ballot = (
        <div className='no-decisions'>
          <h4>No decisions require your attention</h4>
        </div>
      );

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
          <Button className='pull-right submit-ballot' bsStyle='primary' {...disabledProp} onClick={ this.handleSubmitReport }>Save Ballot</Button>
        </div>
      );
      votingDeadlineSpan = (
        <span className='pull-right'>Voting deadline: { publishStart.format('MMM Do [at] HH:mm') }</span>
      );
    }

    let periodDurationNode;

    if (currentBranch.periodDuration != null) {
      periodDurationNode = (
          <span>
            Check for a new ballot every { currentBranch.periodDuration.humanize().replace(/^an? /, '') }.
          </span>
      );
    }

    var markerPosition = percentComplete+'%';
    return (
      <div id="ballots">
        <h3>Ballot<span className='subheading pull-right'>Period { currentBranch.reportPeriod}</span></h3>
        <div className='now-marker' style={{marginLeft: markerPosition}}>&#9662;</div>
        <ProgressBar className='period-progress'>
          <ProgressBar now={ votePercentComplete } key={1} />
          <ProgressBar bsStyle='warning' now={ revealPercentComplete } key={2} />
        </ProgressBar>
        <div className='subheading clearfix'>
          {/*
             FIXME: moment's humanize has peculiar rounding behavior that
             won't always work for us. Period lengths will round to the
             largest unit, and the behavior above 25 days is definitely
             wrong for us.
             http://momentjs.com/docs/#/displaying/fromnow/
           */}
          { periodDurationNode }
          { votingDeadlineSpan }
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
                value="1"
                label="No"
                checked={this.props.decision === "1"}
                onChange={this.handleChange} />
            </div>
            <div className='col-sm-6'>
              <Input
                name={ this.props.event.id }
                type="radio"
                value="1.5"
                label="Ambiguous / Indeterminate"
                checked={this.props.decision === "1.5"}
                onChange={this.handleChange} />
            </div>
            <div className='col-sm-3'>
              <Input
                name={ this.props.event.id }
                type="radio"
                value="2"
                label="Yes"
                checked={this.props.decision === "2"}
                onChange={this.handleChange} />
            </div>
          </div>
        </div>
      </div>
    );
  }

});

module.exports = Ballots;
