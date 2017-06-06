import React, { Component } from 'react';
import classNames from 'classnames';
import Checkbox from 'modules/common/components/checkbox';
import OutcomeOptions from 'modules/reports/components/outcome-options';
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
      isReported: props.isReported
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleOutcomeChange = this.handleOutcomeChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isReported !== this.state.isReported) {
      this.setState({ isReported: nextProps.isReported });
    }
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

    return (
      <article className={classNames('report-form', { reported: s.isReported })}>
        <div className="outcome-options">
          <h4>{!s.isReported ? 'Report the outcome' : 'Outcome Reported'}</h4>
          {p.type === SCALAR &&
            <span>Enter the outcome of this event, if it was at least {p.minValue} and at most {p.maxValue}.  If the outcome was above {p.maxValue}, you should report the outcome as {p.maxValue}; if the outcome was below {p.minValue}, you should report the outcome as {p.minValue}.</span>
          }
          <OutcomeOptions
            type={p.type}
            reportableOutcomes={p.reportableOutcomes}
            reportedOutcomeID={s.reportedOutcomeID}
            isReported={s.isReported}
            isIndeterminate={s.isIndeterminate}
            onOutcomeChange={this.handleOutcomeChange}
          />
        </div>

        <div className="indeterminate">
          <h4>Is this question indeterminate?</h4>
          <span className="indeterminate-message">
            If this question is subjective, vague, or did not have a clear answer on the end date above, you should report indeterminate.
          </span>
          <Checkbox
            className={classNames('indeterminate-checkbox', { disabled: s.isReported })}
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
            className={classNames('unethical-checkbox', { disabled: s.isReported })}
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
      </article>
    );
  }
}
