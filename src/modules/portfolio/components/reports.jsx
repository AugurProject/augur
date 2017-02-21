import React from 'react';
import ReactTooltip from 'react-tooltip';

import Report from 'modules/my-reports/components/my-report';
import Link from 'modules/link/components/link';

const PortfolioReports = p => (
  <div>
    {!!p.reports && !!p.reports.length && p.reports.map(market => (
      <Link key={`${market.marketID}`} {...market.marketLink} >
        <div key={market.marketID}>
          <span className="description">
            {market.description}
            {market.isChallenged &&
              <i
                className="fa fa-gavel outcome-challenged"
                data-tip="This outcome is currently being challenged"
              />
            }
            {!market.isChallenged && market.isChallengeable &&
              <i
                className="fa fa-exclamation-circle outcome-challengeable"
                data-tip="This outcome is eligible to be challenged"
              />
            }
          </span>
          {!!market &&
            <article className="portfolio-list">
              <Report {...market} branch={p.branch} />
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
