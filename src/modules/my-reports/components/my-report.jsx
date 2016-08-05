import React, { PropTypes } from 'react';
import ValueDenomination from '../../../modules/common/components/value-denomination';
import ValueDate from '../../../modules/common/components/value-date';

const Report = (p) => (
	<div className="portfolio-row">
		<div className="portfolio-group portfolio-main-group">
			<span className="report-main-group-title">outcome: </span><span className="report-main-group-title-outcome">{!!p.outcome ? p.outcome : '-'}</span>
			<span className="report-main-group-title">reported: </span><span className="report-main-group-title-outcome">{p.reported}{p.isReportEqual ? <span className="fa report-equal" >&#xf058;</span> : <span className="fa report-unequal" >&#xf057;</span>}</span>
			{!p.isReportEqual && p.isChallengeable &&
				<span>Challange Outcome -- ICON TODO</span>
			}
		</div>
		<div className="portfolio-group">
			<div className="portfolio-pair">
				<span className="title">fees earned</span>
				<ValueDenomination
					className="colorize"
					{...p.feesEarned}
				/>
			</div>
			<div className="portfolio-pair">
				<span className="title">rep earned</span>
				<ValueDenomination
					className="colorize"
					{...p.repEarned}
				/>
			</div>
			<div className="portfolio-pair">
				<span className="title">end date</span>
				<ValueDate {...p.endDate} />
			</div>
		</div>
	</div>
);

Report.propTypes = {
	outcome: PropTypes.string,
	reported: PropTypes.string,
	isReportEqual: PropTypes.bool.isRequired,
	feesEarned: PropTypes.object.isRequired,
	repEarned: PropTypes.object.isRequired,
	endDate: PropTypes.object.isRequired,
	isChallengeable: PropTypes.bool.isRequired
};

export default Report;
