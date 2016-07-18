import React from 'react';
import SummaryItem from '../../../modules/portfolio/components/summary-item';


const PortfolioSummary = (p) => (
	<div className="portfolio-summary" >
		{p.summaries.map((summary, i) => (
			<SummaryItem
				key={`${summary.label}-${i}`}
				label={summary.label}
				value={summary.value}
			/>
		))}
	</div>
);

PortfolioSummary.propTypes = {
	summaries: React.PropTypes.array
};

export default PortfolioSummary;
