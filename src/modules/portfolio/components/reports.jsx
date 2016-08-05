import React from 'react';
import Report from '../../../modules/my-reports/components/my-report';

const PortfolioReports = (p) => (
	<div>
		{!!p.reports && !!p.reports.length && p.reports.map(market => (
			<div key={market.id}>
				<span className="description">{market.description}</span>
				{!!market &&
					<section className="portfolio-list">
						<Report {...market} />
					</section>
				}
			</div>
		))}
	</div>
);

PortfolioReports.propTypes = {
	reports: React.PropTypes.object.isRequired
};

export default PortfolioReports;
