import React from 'react';
import Media from "react-media";

import { ReportingModalButton } from 'modules/reporting/common';
import { Paginator as ReportingList} from 'modules/reporting/reporting-list';
import { UserRepDisplay } from 'modules/reporting/common';
import { REPORTING_STATE, SMALL_MOBILE, TABLET, TINY, DESKTOP, LARGE_DESKTOP, MODAL_DR_QUICK_GUIDE } from "modules/common/constants";
import ModuleTabs from "modules/market/components/common/module-tabs/module-tabs";
import ModulePane from "modules/market/components/common/module-tabs/module-pane";
// @ts-ignore
import Styles from 'modules/reporting/reporting.styles.less';
import { REPORTING_HEAD_TAGS } from 'modules/seo/helmet-configs';
import { HelmetTag } from 'modules/seo/helmet-tag';
import { useAppStatusStore } from 'modules/app/store/app-status';


const Reporting = () => {
  const { isLogged, actions: {setModal}} = useAppStatusStore();
  const showLoggedOut = !isLogged;
  return (
    <section className={Styles.Reporting}>
      <HelmetTag {...REPORTING_HEAD_TAGS} />
      <Media queries={{
        smallMobile: SMALL_MOBILE,
        tablet: TABLET,
        tiny: TINY,
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
                    text='View our Reporting Quick Guide'
                    action={() => setModal({ type: MODAL_DR_QUICK_GUIDE, whichGuide: 'reporting' })}
                  />
                  <UserRepDisplay />
                  <ReportingList
                    reportingType={REPORTING_STATE.DESIGNATED_REPORTING}
                    title='Designated Reporting'
                    showLoggedOut={showLoggedOut}
                    loggedOutMessage='Connect a wallet to see your markets that are ready for Reporting.'
                    emptyHeader='There are no markets available for you to Report on.'
                    emptySubheader='Check your Upcoming Designated Reporting to see Markets that will soon be available for reporting.'
                  />
                  <ReportingList
                    reportingType={REPORTING_STATE.PRE_REPORTING}
                    title='Upcoming Designated Reporting'
                    showLoggedOut={showLoggedOut}
                    loggedOutMessage='Connect a wallet to see your markets that will soon be ready to Report on.'
                    emptyHeader='There are no markets coming up in the next week for you to Report on.'
                    emptySubheader='Check your Upcoming Designated Reporting to see Markets that will soon be available to Report on.'
                  />
                </ModulePane>
                <ModulePane label='Open reporting'>
                  <ReportingModalButton
                    highlightedText='Need Help?'
                    text='View our Reporting Quick Guide'
                    action={() => setModal({ type: MODAL_DR_QUICK_GUIDE, whichGuide: 'reporting' })}
                  />
                  <ReportingList
                    reportingType={REPORTING_STATE.OPEN_REPORTING}
                    title='Open Reporting'
                    emptyHeader='There are currently no markets in Open Reporting.'
                    emptySubheader='Markets appear here if a Designated Reporter fails to show up.'
                  />
                </ModulePane>
              </ModuleTabs>
            )}
            {matches.tiny || matches.tablet && (
              <>
                <div>
                  <ReportingList
                    reportingType={REPORTING_STATE.DESIGNATED_REPORTING}
                    title='Designated Reporting'
                    showLoggedOut={showLoggedOut}
                    loggedOutMessage='Connect a wallet to see your markets that are ready for Reporting.'
                    emptyHeader='There are no markets available for you to Report on.'
                    emptySubheader='Check your Upcoming Designated Reporting to see Markets that will soon be available to Report on.'
                  />
                  <ReportingList
                    reportingType={REPORTING_STATE.PRE_REPORTING}
                    title='Upcoming Designated Reporting'
                    showLoggedOut={showLoggedOut}
                    loggedOutMessage='Connect a wallet to see your markets that will soon be ready to Report on.'
                    emptyHeader='There are no markets coming up in the next week for you to Report on.'
                    emptySubheader='Check your Upcoming Designated Reporting to see Markets that will soon be available to Report on.'
                  />
                </div>
                <div>
                  <ReportingModalButton
                    highlightedText='Need Help?'
                    text='View our Reporting Quick Guide'
                    action={() => setModal({ type: MODAL_DR_QUICK_GUIDE, whichGuide: 'reporting' })}
                  />
                  <UserRepDisplay />
                  <ReportingList
                    reportingType={REPORTING_STATE.OPEN_REPORTING}
                    title='Open Reporting'
                    emptyHeader='There are currently no markets in Open Reporting.'
                    emptySubheader='Markets appear here once if a Designated Reporter fails to show up.'
                  />
                </div>
              </>
            )}
            {(matches.desktop || matches.largeDesktop) && (
              <>
                <div>
                  <ReportingList
                    reportingType={REPORTING_STATE.DESIGNATED_REPORTING}
                    title='Designated Reporting'
                    showLoggedOut={showLoggedOut}
                    loggedOutMessage='Connect a wallet to see your markets that are ready for Reporting.'
                    emptyHeader='There are no markets available for you to Report on.'
                    emptySubheader='Check your Upcoming Designated Reporting to see Markets that will soon be available to Report on.'
                  />
                  <ReportingList
                    reportingType={REPORTING_STATE.PRE_REPORTING}
                    title='Upcoming Designated Reporting'
                    showLoggedOut={showLoggedOut}
                    loggedOutMessage='Connect a wallet to see your markets that will soon be ready to Report on.'
                    emptyHeader='There are no markets coming up in the next week for you to Report on.'
                    emptySubheader='Check your Upcoming Designated Reporting to see Markets that will soon be available to Report on.'
                  />
                  <ReportingList
                    reportingType={REPORTING_STATE.OPEN_REPORTING}
                    title='Open Reporting'
                    emptyHeader='There are currently no markets in Open Reporting.'
                    emptySubheader='Markets appear here once if a Designated Reporter fails to show up.'
                  />
                </div>
                <div>
                  <ReportingModalButton
                    highlightedText='Need Help?'
                    text='View our Reporting Quick Guide'
                    action={() => setModal({ type: MODAL_DR_QUICK_GUIDE, whichGuide: 'reporting' })}
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

export default Reporting;