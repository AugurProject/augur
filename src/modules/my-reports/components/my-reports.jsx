import React, { PropTypes } from 'react';
import ReactTooltip from 'react-tooltip';

import NullStateMessage from 'modules/common/components/null-state-message';
import MyReport from 'modules/my-reports/components/my-report';
import Link from 'modules/link/components/link';

const MyReports = p => (
  <article className="my-reports">
    {p.reports && p.reports.length ?
      <div>
        {p.reports.map(market => (
          <div
            key={market.marketID}
            className="portfolio-market"
          >
            <div
              className="portfolio-market-overview"
            >
              <Link
                {...market.marketLink}
              >
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
              </Link>
            </div>
            <MyReport
              {...market}
              branch={p.branch}
            />
          </div>
        ))}
      </div> :
      <NullStateMessage message="No Reports Made" />
    }
    <ReactTooltip type="light" effect="solid" place="top" />
  </article>
);

MyReports.propTypes = {
  reports: PropTypes.array.isRequired
};

export default MyReports;
