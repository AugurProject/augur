import React from 'react';

import { Helmet } from 'react-helmet';
import { ButtonActionType, MarketData } from 'modules/types';
import { ReportingModalButton } from 'modules/reporting/common';
import { ReportingList } from 'modules/reporting/reporting-list';
import UserRepDisplay from 'modules/reporting/containers/user-rep-display';

import Styles from 'modules/reporting/reporting.styles.less';

interface ReportingProps {
  upcomingMarkets: Array<MarketData>;
  openMarkets: Array<MarketData>;
  designatedReporterMarkets: Array<MarketData>;
  openReportingModal: ButtonActionType;
}

export default class Reporting extends React.Component<ReportingProps> {

  render() {
    const {
      designatedReporterMarkets,
      openMarkets,
      upcomingMarkets
    } = this.props;

    return (
      <section className={Styles.Reporting}>
        <Helmet>
          <title>Reporting</title>
        </Helmet>
        <div>
          <ReportingList
            markets={designatedReporterMarkets}
            title={"Designated Reporting"}
          />
          <ReportingList
            markets={upcomingMarkets}
            title={"Upcoming Designated Reporting"}
          />
          <ReportingList
            markets={openMarkets}
            title={"Open Reporting"}
          />
        </div>
        <div>
          <UserRepDisplay />
          <ReportingModalButton
            text="Designated Reporting Quick Guide"
            action={this.props.openReportingModal}
          />
        </div>
      </section>
    );
  }
}
