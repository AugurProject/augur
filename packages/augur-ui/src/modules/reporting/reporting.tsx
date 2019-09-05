import React from 'react';

import { Helmet } from 'react-helmet';
import { ButtonActionType, MarketData } from 'modules/types';
import { ReportingModalButton } from 'modules/reporting/common';
import ReportingList from 'modules/reporting/containers/reporting-list';
import UserRepDisplay from 'modules/reporting/containers/user-rep-display';

import Styles from 'modules/reporting/reporting.styles.less';
import { REPORTING_STATE } from 'modules/common/constants';

interface ReportingProps {
  openReportingModal: ButtonActionType;
}

export default class Reporting extends React.Component<ReportingProps> {
  render() {
    const { openReportingModal } = this.props;

    return (
      <section className={Styles.Reporting}>
        <Helmet>
          <title>Reporting</title>
        </Helmet>
        <div>
          <ReportingList
            reportingType={REPORTING_STATE.DESIGNATED_REPORTING}
            title={'Designated Reporting'}
            loggedOutMessage="Connect a wallet to see your markets that are ready for Reporting."
            emptyHeader="There are no markets available for you to Report on."
            emptySubheader=" Check your Upcoming Designated Reporting to see Markets that will soon be availble to Report on."
          />
          <ReportingList
            reportingType={REPORTING_STATE.PRE_REPORTING}
            title={'Upcoming Designated Reporting'}
            loggedOutMessage="Connect a wallet to see your markets that will soon be ready to Report on."
            emptyHeader="There are no markets coming up in the next week for you to Report on. "
            emptySubheader="Check your Upcoming Designated Reporting to see Markets that will soon be availble to Report on."
          />
          <ReportingList
            reportingType={REPORTING_STATE.OPEN_REPORTING}
            title={'Open Reporting'}
            emptyHeader="There are currently no markets in Open Reporting. "
            emptySubheader=" Markets appear here once if a Designated Reporter fails to show up."
          />
        </div>
        <div>
          <UserRepDisplay />
          <ReportingModalButton
            text="Designated Reporting Quick Guide"
            action={openReportingModal}
          />
        </div>
      </section>
    );
  }
}
