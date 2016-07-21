import React from 'react';
import SummaryItem from '../../../modules/portfolio/components/summary-item';

const PortfolioSummary = (p) => (
	<header className="header-bar portfolio-summary" >
		{!!p.summaries && p.summaries.map((summary, i) => (
			<SummaryItem
				key={`${summary.label}-${i}`}
				label={summary.label}
				value={summary.value}
			/>
		))}
	</header>
);

PortfolioSummary.propTypes = {
	summaries: React.PropTypes.array
};

export default PortfolioSummary;
