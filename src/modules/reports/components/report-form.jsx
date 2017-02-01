import React, { Component } from 'react';
import classnames from 'classnames';

import Checkbox from 'modules/common/components/checkbox';
import { BINARY, SCALAR } from 'modules/markets/constants/market-types';

export default class ReportForm extends Component {
  // TODO -- Prop Validations
  static propTypes = {
    type: React.PropTypes.string,
    minValue: React.PropTypes.string,
    maxValue: React.PropTypes.string,
    // reportableOutcomes: React.PropTypes.array,
    reportedOutcomeID: React.PropTypes.any,
    isIndeterminate: React.PropTypes.bool,
    isUnethical: React.PropTypes.bool,
    isReported: React.PropTypes.bool,
    onClickSubmit: React.PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      type: props.type,
      minValue: props.minValue,
      maxValue: props.maxValue,
      reportedOutcomeID: props.reportedOutcomeID,
      isIndeterminate: props.isIndeterminate,
      isUnethical: props.isUnethical,
      isReported: props.isReported,
      slashRep: {
        reporter: undefined,
        report: undefined,
        salt: undefined,
        isIndeterminate: false,
        isUnethical: false
      }
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleOutcomeChange = this.handleOutcomeChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isReported !== this.state.isReported) {
      this.setState({ isReported: nextProps.isReported });
    }
  }

  handleSlashRepChange(slashRepInfo) {
    this.setState({ ...this.state.slashRep, ...slashRepInfo });
  }

  handleOutcomeChange = e => this.setState({ reportedOutcomeID: e.target.value });

  handleSubmit() {
    this.props.onClickSubmit(this.state.reportedOutcomeID, this.state.isUnethical, this.state.isIndeterminate);
    this.setState({ reportedOutcomeID: '', isIndeterminate: undefined, isUnethical: undefined, isReported: false });
  }

  render() {
    const p = this.props;
    const s = this.state;
    const indeterminateValue = p.type === BINARY ? '1.5' : '0.5';

    let outcomeOptions;
    if (p.type === SCALAR) {
      outcomeOptions = (
        <div className="reportable-outcomes">
          <label
            key="scalar-outcome"
            className="outcome-option"
            htmlFor="outcome-scalar-input"
          >
            <input
              type="text"
              className="outcome-option-input"
              name="outcome-scalar-input"
              value={s.reportedOutcomeID}
              disabled={s.isReported || s.isIndeterminate}
              onChange={this.handleOutcomeChange}
            />
          </label>
        </div>
      );
    } else {
      outcomeOptions = (
        <div className="reportable-outcomes">
          {(p.reportableOutcomes || []).map(outcome => (
            <label
              key={outcome.id}
              className={classnames('outcome-option', { disabled: s.isReported || s.isIndeterminate })}
              htmlFor="outcome-option-radio"
            >
              <input
                type="radio"
                className="outcome-option-radio"
                name="outcome-option-radio"
                value={outcome.id}
                checked={s.reportedOutcomeID === outcome.id}
                disabled={s.isReported || s.isIndeterminate}
                onChange={this.handleOutcomeChange}
              />
              {outcome.name}
            </label>
          ))}
        </div>
      );
    }

    return (
      <article className={classnames('report-form', { reported: s.isReported })}>
        <div className="outcome-options">
          <h4>{!s.isReported ? 'Report the outcome' : 'Outcome Reported'}</h4>
          {p.type === SCALAR &&
            <span>Enter the outcome of this event, if it was at least {p.minValue} and at most {p.maxValue}.  If the outcome was above {p.maxValue}, you should report the outcome as {p.maxValue}; if the outcome was below {p.minValue}, you should report the outcome as {p.minValue}.</span>
          }
          {outcomeOptions}
        </div>

        <div className="indeterminate">
          <h4>Is this question indeterminate?</h4>
          <span className="indeterminate-message">
            If this question is subjective, vague, or did not have a clear answer on the end date above, you should report indeterminate.
          </span>

          <Checkbox
            className={classnames('indeterminate-checkbox', { disabled: s.isReported })}
            text="Yes, this question is indeterminate"
            isChecked={!!s.isIndeterminate}
            onClick={(!s.isReported && (() => this.setState({
              isIndeterminate: !s.isIndeterminate,
              reportedOutcomeID: indeterminateValue
            }))) || undefined}
          />
        </div>

        <div className="unethical">
          <h4>Is this question unethical?</h4>
          <span className="unethical-message">
            The consensus answer to this question will be over-ridden if the question is reported as unethical by 60% (or more) of those reporting this market.
          </span>

          <Checkbox
            className={classnames('unethical-checkbox', { disabled: s.isReported })}
            text="Yes, this question is unethical"
            isChecked={!!s.isUnethical}
            onClick={(!s.isReported && (() => this.setState({ isUnethical: !s.isUnethical }))) || undefined}
          />
        </div>

        <div className="report-actions">
          {!s.isReported &&
            <button
              className="button report"
              disabled={!s.reportedOutcomeID}
              onClick={(!!s.reportedOutcomeID && !s.isReported && this.handleSubmit) || undefined}
            >
              Submit Report
            </button>
          }
          {s.isReported &&
            <button
              className="button report-again"
              onClick={() => this.setState({ isReported: false })}
            >
              Report Again
            </button>
          }
        </div>

        <div className="outcome-options">
          <span>
            It is important for Augur&#39;s security that Reporters keep their reports <b>secret</b> until the first half of the reporting cycle is complete (in ${p.branch.phaseTimeRemaining}).  If another Reporter has disclosed their Report (and its accompanying random salt) to you, you can enter the other Reporter&#39;s reported values here and you will receive half of their Reputation balance.  (Note: there is no penalty to you if this fails.  The other Reporter will only be notified if the information you enter matches their report.)
          </span>
          <label htmlFor="slash-rep-reporter">
            Ethereum address of cheater
            <input
              type="text"
              className="slash-rep-input"
              name="slash-rep-reporter"
              value={s.slashRep.reporter}
              onChange={reporter => this.handleSlashRepChange({ reporter })}
            />
          </label>
          <label htmlFor="slash-rep-report">
            Outcome reported by cheater
            <input
              type="text"
              className="slash-rep-input"
              name="slash-rep-report"
              disabled={!!s.slashRep.isIndeterminate}
              value={s.slashRep.report}
              onChange={report => this.handleSlashRepChange({ report })}
            />
            <Checkbox
              className="indeterminate-checkbox"
              text="Indeterminate"
              isChecked={s.slashRep.isIndeterminate}
              onClick={isIndeterminate => this.handleSlashRepChange({ isIndeterminate })}
            />
            <Checkbox
              className="unethical-checkbox"
              text="Unethical"
              isChecked={s.slashRep.isUnethical}
              onClick={isUnethical => this.handleSlashRepChange({ isUnethical })}
            />
          </label>
          <label htmlFor="slash-rep-salt">
            Random salt used by cheater
            <input
              type="text"
              className="slash-rep-input"
              name="slash-rep-salt"
              value={s.slashRep.salt}
              onChange={salt => this.handleSlashRepChange({ salt })}
            />
          </label>
        </div>
        <div className="submit-slash-rep">
          <button
            className="button"
            disabled={(!s.slashRep.reporter && !s.slashRep.report && !s.slashRep.salt)}
            onClick={() => this.handleSubmitSlashRep(s.slashRep.salt, s.slashRep.report, s.slashRep.reporter, s.slashRep.isIndeterminate, s.slashRep.isUnethical)}
          >
            Fine Reporter
          </button>
        </div>
      </article>
    );
  }
}
