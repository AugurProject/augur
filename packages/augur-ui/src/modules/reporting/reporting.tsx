import React from 'react';
import Media from "react-media";

import { ButtonActionType } from 'modules/types';
import { ReportingModalButton } from 'modules/reporting/common';
import ReportingList from 'modules/reporting/containers/reporting-list';
import UserRepDisplay from 'modules/reporting/containers/user-rep-display';
import { REPORTING_STATE, SMALL_MOBILE, TABLET, DESKTOP, LARGE_DESKTOP } from "modules/common/constants";
import ModuleTabs from "modules/market/components/common/module-tabs/module-tabs";
import ModulePane from "modules/market/components/common/module-tabs/module-pane";

import Styles from 'modules/reporting/reporting.styles.less';
import { REPORTING_HEAD_TAGS } from 'modules/seo/helmet-configs';
import { HelmetTag } from 'modules/seo/helmet-tag';

interface ReportingProps {
  showLoggedOut: boolean;
  openReportingModal: ButtonActionType;
}

export default class Reporting extends React.Component<ReportingProps> {
  render() {
    const { openReportingModal, showLoggedOut } = this.props;

    return (
      <section className={Styles.Reporting}>
        <HelmetTag {...REPORTING_HEAD_TAGS} />
        <Media queries={{
          smallMobile: SMALL_MOBILE,
          tablet: TABLET,
          desktop: DESKTOP,
          largeDesktop: LARGE_DESKTOP
        }}>
          {matches => (
            <>
              {matches.smallMobile && (
                <ModuleTabs selected={0} fillWidth noBorder>
                  <ModulePane label="designated reporting">
                    <ReportingModalButton
                      highlightedText='Need Help?'
                      text='Reporting Quick Guide'
                      action={openReportingModal}
                    />
                    <UserRepDisplay />
                    <ReportingList
                      reportingType={REPORTING_STATE.DESIGNATED_REPORTING}
                      title={'Designated Reporting'}
                      showLoggedOut={showLoggedOut}
                      loggedOutMessage='Connect a wallet to see your markets that are ready for reporting.'
                      emptyHeader='There are no markets available for you to report on.'
                      emptySubheader='Check your upcoming designated reporting to see markets that will soon be available for reporting.'
                    />
                    <ReportingList
                      reportingType={REPORTING_STATE.PRE_REPORTING}
                      title={'Upcoming Designated Reporting'}
                      showLoggedOut={showLoggedOut}
                      loggedOutMessage='Connect a wallet to see your markets that will soon be ready to report on.'
                      emptyHeader='There are no markets coming up in the next week for you to report on.'
                      emptySubheader=''
                    />
                  </ModulePane>
                  <ModulePane label='Open reporting'>
                    <ReportingModalButton
                      highlightedText='Need Help?'
                      text='Reporting Quick Guide'
                      action={openReportingModal}
                    />
                    <ReportingList
                      reportingType={REPORTING_STATE.OPEN_REPORTING}
                      title={'Open Reporting'}
                      emptyHeader='There are currently no markets in open reporting.'
                      emptySubheader='Markets appear here if a designated reporter fails to show up.'
                    />
                  </ModulePane>
                </ModuleTabs>
              )}
              {matches.tablet && (
                <>
                  <div>
                    <ReportingList
                      reportingType={REPORTING_STATE.DESIGNATED_REPORTING}
                      title={'Designated Reporting'}
                      showLoggedOut={showLoggedOut}
                      loggedOutMessage='Connect a wallet to see your markets that are ready for reporting.'
                      emptyHeader='There are no markets available for you to report on.'
                      emptySubheader='Check your upcoming designated reporting to see markets that will soon be available to report on.'
                    />
                    <ReportingList
                      reportingType={REPORTING_STATE.PRE_REPORTING}
                      title={'Upcoming Designated Reporting'}
                      showLoggedOut={showLoggedOut}
                      loggedOutMessage='Connect a wallet to see your markets that will soon be ready to Report on.'
                      emptyHeader='There are no markets coming up in the next week for you to report on.'
                      emptySubheader=''
                    />
                  </div>
                  <div>
                    <ReportingModalButton
                      highlightedText='Need Help?'
                      text='Reporting Quick Guide'
                      action={openReportingModal}
                    />
                    <UserRepDisplay />
                    <ReportingList
                      reportingType={REPORTING_STATE.OPEN_REPORTING}
                      title={'Open Reporting'}
                      emptyHeader='There are currently no markets in open reporting.'
                      emptySubheader='Markets appear here once if a designated reporter fails to show up.'
                    />
                  </div>
                </>
              )}
              {(matches.desktop || matches.largeDesktop) && (
                <>
                  <div>
                    <ReportingList
                      reportingType={REPORTING_STATE.DESIGNATED_REPORTING}
                      title={'Designated Reporting'}
                      showLoggedOut={showLoggedOut}
                      loggedOutMessage='Connect a wallet to see your markets that are ready for Reporting.'
                      emptyHeader='There are no markets available for you to report on.'
                      emptySubheader='Check your upcoming designated reporting to see markets that will soon be available to report on.'
                    />
                    <ReportingList
                      reportingType={REPORTING_STATE.PRE_REPORTING}
                      title={'Upcoming Designated Reporting'}
                      showLoggedOut={showLoggedOut}
                      loggedOutMessage='Connect a wallet to see your markets that will soon be ready to Report on.'
                      emptyHeader='There are no markets coming up in the next week for you to report on.'
                      emptySubheader=''
                    />
                    <ReportingList
                      reportingType={REPORTING_STATE.OPEN_REPORTING}
                      title={'Open Reporting'}
                      emptyHeader='There are currently no markets in open reporting.'
                      emptySubheader='Markets appear here once if a designated reporter fails to show up.'
                    />
                  </div>
                  <div>
                    <ReportingModalButton
                      highlightedText='Need Help?'
                      text='Reporting Quick Guide'
                      action={openReportingModal}
                    />
                    <UserRepDisplay />
                  </div>
                </>
              )}
            </>
          )
        }
      </Media>
      </section>
    );
  }
}
