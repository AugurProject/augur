import React from 'react';
import classnames from 'classnames';
import Checkbox from '../../common/components/checkbox';

export default class ReportForm extends React.Component {
	static propTypes = {
		reportableOutcomes: React.PropTypes.array,
		reportedOutcomeID: React.PropTypes.any,
		isIndeterminate: React.PropTypes.bool,
		isUnethical: React.PropTypes.bool,
		isReported: React.PropTypes.bool,
		onClickSubmit: React.PropTypes.func
	};

	constructor(props) {
		super(props);
		this.state = {
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

	handleOutcomeChange = (e) => this.setState({ reportedOutcomeID: e.target.value });

	handleSubmit() {
		this.props.onClickSubmit(this.state.reportedOutcomeID, this.state.isUnethical, this.state.isIndeterminate);
		this.setState({ reportedOutcomeID: null, isIndeterminate: null, isUnethical: null, isReported: false });
	}

	render() {
		const p = this.props;
		const s = this.state;

		return (
			<section className={classnames('report-form', { reported: s.isReported })}>
				<div className="outcome-options">
					<h4>{!s.isReported ? 'Report the outcome' : 'Outcome Reported'}</h4>

					{(p.reportableOutcomes || []).map(outcome => (
						<label key={outcome.id} className={classnames('outcome-option', { disabled: s.isReported })}>
							<input
								type="radio"
								className="outcome-option-radio"
								name="outcome-option-radio"
								value={outcome.id}
								checked={s.reportedOutcomeID === outcome.id}
								disabled={s.isReported}
								onChange={this.handleOutcomeChange}
							/>
							{outcome.name}
						</label>
					))}
				</div>

				<div className="indeterminate">
					<h4>Is this question indeterminate?</h4>

					<Checkbox
						className={classnames('indeterminate-checkbox', { disabled: s.isReported })}
						text="Yes, this question is indeterminate"
						isChecked={!!s.isIndeterminate}
						onClick={!s.isReported && (() => this.setState({ isIndeterminate: !s.isIndeterminate })) || null}
					/>

					<span className="indeterminate-message">
						If this question is subjective, vague, or does not yet have a clear answer, you should report indeterminate.
					</span>
				</div>

				<div className="unethical">
					<h4>Is this question unethical?</h4>

					<Checkbox
						className={classnames('unethical-checkbox', { disabled: s.isReported })}
						text="Yes, this question is unethical"
						isChecked={!!s.isUnethical}
						onClick={!s.isReported && (() => this.setState({ isUnethical: !s.isUnethical })) || null}
					/>

					<span className="unethical-message">
						The consensus answer to this question will be over-ridden if the question is reported as unethical by 60% (or more) of those reporting this market.
					</span>
				</div>

				{!s.isReported &&
					<button
						className="button report"
						disabled={!s.reportedOutcomeID}
						onClick={!!s.reportedOutcomeID && !s.isReported && this.handleSubmit || null}
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
			</section>
		);
	}
}
