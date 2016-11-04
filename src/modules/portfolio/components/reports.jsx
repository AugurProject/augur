import React from 'react';
import ReactTooltip from 'react-tooltip';

import Report from 'modules/my-reports/components/my-report';
import Link from 'modules/link/components/link';

const PortfolioReports = p => (
	<div>
		{!!p.reports && !!p.reports.length && p.reports.map(market => (
			<Link key={market.id} {...market.marketLink} >
				<div key={market.id}>
					<span className="description">
						{market.description}
						{market.isChallenged &&
							<span
								className="fa outcome-challenged"
								data-tip="This outcome is currently being challenged"
							>
								&#xf0e3;
							</span>
						}
						{!market.isChallenged && market.isChallengeable &&
							<span
								className="fa outcome-challengeable"
								data-tip="This outcome is eligible to be challenged"
							>
								&#xf06a;
							</span>
						}
					</span>
					{!!market &&
						<article className="portfolio-list">
							<Report {...market} />
						</article>
					}
				</div>
			</Link>
		))}
		<ReactTooltip type="light" effect="solid" place="top" />
	</div>
);

// TODO -- Prop Validations
// PortfolioReports.propTypes = {
// 	reports: React.PropTypes.array.isRequired
// };

export default PortfolioReports;
