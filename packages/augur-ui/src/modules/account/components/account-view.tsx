import React from "react";
import Media from "react-media";

import TermsAndConditions from "modules/app/containers/terms-and-conditions";
import Notifications from "modules/account/containers/notifications";
import Transactions from "modules/account/containers/transactions";
import AugurStatus from "modules/account/containers/augur-status";
import Favorites from "modules/portfolio/containers/favorites";
import OpenMarkets from "modules/account/containers/open-markets";
import Overview from "modules/account/containers/overview";
import ModuleTabs from "modules/market/components/common/module-tabs/module-tabs";
import ModulePane from "modules/market/components/common/module-tabs/module-pane";
import {
  SMALL_MOBILE,
  YOUR_OVERVIEW_TITLE,
  AUGUR_STATUS_TITLE,
  TABLET,
  DESKTOP,
  LARGE_DESKTOP,
} from "modules/common/constants";

import Styles from "modules/account/components/account-view.styles.less";

export interface AccountViewProps {
  newNotifications?: boolean;
}

const AccountView = (props: AccountViewProps) => (
  <>
    <Media query={SMALL_MOBILE}>
      {(matches) =>
        matches ? (
          <ModuleTabs selected={0} fillWidth noBorder>
            // @ts-ignore
            <ModulePane label={YOUR_OVERVIEW_TITLE}>
              <Overview />
            </ModulePane>
            // @ts-ignore
            <ModulePane label="Notifications" isNew={props.newNotifications}>
              <Notifications />
            </ModulePane>
            // @ts-ignore
            <ModulePane label="Watchlist">
              <Favorites />
            </ModulePane>
            // @ts-ignore
            <ModulePane label="My Active Markets">
              <OpenMarkets />
            </ModulePane>
            // @ts-ignore
            <ModulePane label={AUGUR_STATUS_TITLE}>
              <AugurStatus />
            </ModulePane>
            // @ts-ignore
            <ModulePane label="Transactions">
              <Transactions />
            </ModulePane>
          </ModuleTabs>
        ) : (
          <section className={Styles.AccountView}>
            <div>
              <Media query={TABLET}>
                {(matches) =>
                  matches && (
                    <>
                      <div>
                        <Notifications />
                        <OpenMarkets />
                        <AugurStatus />
                      </div>
                      <div>
                        <Overview />
                        <Favorites />
                        <Transactions />
                      </div>
                    </>
                  )
                }
              </Media>
              <Media query={DESKTOP}>
                {(matches) =>
                  matches && (
                    <>
                      <div>
                        <Notifications />
                        <OpenMarkets />
                      </div>
                      <div>
                        <Overview />
                        <AugurStatus />
                      </div>
                      <div>
                        <Favorites />
                        <Transactions />
                      </div>
                    </>
                  )
                }
              </Media>
              <Media query={LARGE_DESKTOP}>
                {(matches) =>
                  matches && (
                    <>
                      <div>
                        <Notifications />
                        <AugurStatus />
                      </div>
                      <div>
                        <Overview />
                        <Transactions />
                      </div>
                      <div>
                        <Favorites />
                        <OpenMarkets />
                      </div>
                    </>
                  )
                }
              </Media>
            </div>
            <TermsAndConditions />
          </section>
        )
      }
    </Media>
  </>
);

export default AccountView;
