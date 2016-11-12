import React from 'react';
import ReactTooltip from 'react-tooltip';

import ValueDenomination from 'modules/common/components/value-denomination';
import ValueDate from 'modules/common/components/value-date';

const Report = p => (
	<div className="portfolio-row">
		<div className="portfolio-group portfolio-main-group">
			<div className="portfolio-pair">
				<span className="report-main-group-title">outcome: </span>
				<span className="report-main-group-title-outcome">
					{p.outcome ?
						<span>{p.outcome}  (<ValueDenomination {...p.outcomePercentage} />)</span> : '-'
					}
				</span>
			</div>
			<div className="portfolio-pair">
				<span className="report-main-group-title">reported: </span>
				<span className="report-main-group-title-outcome">
					{!!p.isCommitted && !p.isRevealed &&
						<span
							className="report-committed"
							data-tip="You have successfully committed to this report. Remember to login to reveal the report!"
						>
							{p.reported || '-'}
						</span>
					}
					{!!p.isRevealed &&
						<span className="report-revealed">
							{p.reported || '-'}
						</span>
					}
					{!p.isRevealed && !p.isCommitted &&
						<span>{p.reported || '-'}</span>
					}
					{!!p.outcome && p.isReportEqual &&
						<span
							className="fa report-equal"
							data-tip="Your report matches the consensus outcome"
						>
							&#xf058;
						</span>
					}
					{!!p.outcome && !p.isReportEqual &&
						<span
							className="fa report-unequal"
							data-tip="Your report does not match the consensus outcome"
						>
							&#xf057;
						</span>
					}
					{!!p.isUnethical &&
						<span
							className="fa report-unethical"
							data-tip="You reported that this market is unethical"
						>
							&#xf165;
						</span>
					}
				</span>
			</div>
			<div className="portfolio-pair">
				<span className="report-main-group-title">cycle: </span>
				<span className="report-main-group-title-outcome">
					{p.period ?
						<span
							data-tip={`${p.branch.currentPeriod - p.period} reporting cycles ago`}
						>
							{p.period}
						</span> :
						'-'
					}
				</span>
			</div>
		</div>
		<div className="portfolio-group">
			{/*
			<div className="portfolio-pair">
				<span className="title">fees gain/loss</span>
				<ValueDenomination
					className="colorize"
					{...p.feesEarned}
				/>
			</div>
			*/}
			<div className="portfolio-pair">
				<span className="title">rep gain/loss</span>
				<ValueDenomination
					className="colorize"
					{...p.repEarned}
				/>
			</div>
			<div className="portfolio-pair">
				<span className="title">ended</span>
				<ValueDate {...p.endDate} />
			</div>
		</div>
		<ReactTooltip type="light" effect="solid" place="top" />
	</div>
);

// TODO -- Prop Validations
// Report.propTypes = {
// 	outcome: PropTypes.string,
// 	reported: PropTypes.string,
// 	isReportEqual: PropTypes.bool.isRequired,
// 	feesEarned: PropTypes.object.isRequired,
// 	repEarned: PropTypes.object.isRequired,
// 	endDate: PropTypes.object.isRequired
// };

export default Report;
