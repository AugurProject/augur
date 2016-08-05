import React from 'react';
import Report from '../../../modules/my-reports/components/my-report';

const PortfolioReports = (p) => (
	<div>
		{!!p.reports && !!p.reports.length && p.reports.map(market => (
			<div key={market.id}>
				<span className="description">
					{market.description}
					{market.isChallenged &&
						<span
							className="fa outcome-challenged"
							title="This outcome is currently being challenged"
						>
							&#xf0e3;
						</span>
					}
					{!market.isChallenged && market.isChallengeable &&
						<span
							className="fa outcome-challengeable"
							title="This outcome may be challenged"
						>
							&#xf06a;
						</span>
					}
				</span>
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
