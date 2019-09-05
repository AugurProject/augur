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
  isLogged: boolean;
}

export default class Reporting extends React.Component<ReportingProps> {

  render() {
    const {
      designatedReporterMarkets,
      openMarkets,
      upcomingMarkets,
      isLogged
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
            loggedOutMessage="Connect a wallet to see your markets that are ready for Reporting."
            showLoggedOut={!isLogged}
            emptyHeader="There are no markets available for you to Report on." 
            emptySubheader=" Check your Upcoming Designated Reporting to see Markets that will soon be availble to Report on."
          />
          <ReportingList 
            markets={upcomingMarkets}
            title={"Upcoming Designated Reporting"}
            loggedOutMessage="Connect a wallet to see your markets that will soon be ready to Report on."
            showLoggedOut={!isLogged}
            emptyHeader="There are no markets coming up in the next week for you to Report on. "
            emptySubheader="Check your Upcoming Designated Reporting to see Markets that will soon be availble to Report on."
          />
          <ReportingList 
            markets={openMarkets}
            title={"Open Reporting"}
            emptyHeader="There are currently no markets in Open Reporting. "
            emptySubheader=" Markets appear here once if a Designated Reporter fails to show up."
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
