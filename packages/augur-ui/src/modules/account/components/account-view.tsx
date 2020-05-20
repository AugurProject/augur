import React, { useState } from 'react';
import Media from 'react-media';

import TermsAndConditions from 'modules/app/components/terms-and-conditions';
import Notifications from 'modules/account/components/notifications';
import Transactions from 'modules/account/containers/transactions';
import AugurStatus from 'modules/account/components/augur-status';
import Favorites from 'modules/portfolio/containers/favorites';
import MyMarkets from 'modules/portfolio/containers/my-markets';
import OpenMarkets from 'modules/account/containers/open-markets';
import Overview from 'modules/account/components/overview';
import ModuleTabs from 'modules/market/components/common/module-tabs/module-tabs';
import ModulePane from 'modules/market/components/common/module-tabs/module-pane';
import {
  SMALL_MOBILE,
  YOUR_OVERVIEW_TITLE,
  AUGUR_STATUS_TITLE,
  THEMES,
} from 'modules/common/constants';
import Styles from 'modules/account/components/account-view.styles.less';
import classNames from 'classnames';
import { ACCOUNT_VIEW_HEAD_TAGS } from 'modules/seo/helmet-configs';
import { HelmetTag } from 'modules/seo/helmet-tag';
import { useAppStatusStore } from 'modules/app/store/app-status';

const AccountView = () => {
  const [state, setState] = useState({
    extendNotifications: false,
    extendActiveMarkets: false,
    extendWatchlist: false,
    extendTransactions: false,
  });
  const { theme, notifications } = useAppStatusStore();
  const newNotifications = notifications.filter(item => item.isNew).length > 0;

  const {
    extendActiveMarkets,
    extendWatchlist,
    extendNotifications,
  } = state;

  function toggle(extend: string, hide: string) {
    setState({ ...state, [extend]: !state[extend], [hide]: false });
  };

  return (
    <>
      <HelmetTag {...ACCOUNT_VIEW_HEAD_TAGS} />
      <Media query={SMALL_MOBILE}>
        {matches =>
          matches ? (
            <ModuleTabs selected={0} fillWidth noBorder>
              <ModulePane label={YOUR_OVERVIEW_TITLE}>
                <Overview />
              </ModulePane>
              <ModulePane label="Notifications" isNew={newNotifications}>
                <Notifications />
              </ModulePane>
              <ModulePane label="My Active Markets">
                <OpenMarkets />
              </ModulePane>
              <ModulePane label="Watchlist">
                <Favorites />
              </ModulePane>
              <ModulePane label="Transactions">
                <Transactions />
              </ModulePane>
              <ModulePane label={AUGUR_STATUS_TITLE}>
                <AugurStatus />
              </ModulePane>
            </ModuleTabs>
          ) : 
          theme === THEMES.TRADING ? (
            <div
              className={classNames(Styles.AccountView, {
                [Styles.HideNotifications]: extendActiveMarkets,
                [Styles.HideTransactions]: extendWatchlist,
                [Styles.HideActiveMarkets]: extendNotifications,
              })}
            >
              <Notifications
                toggle={() =>
                  toggle('extendActiveMarkets', 'extendNotifications')
                }
              />
              <ModuleTabs selected={0}>
                <ModulePane label={YOUR_OVERVIEW_TITLE}>
                  <Overview hideHeader={true} />
                </ModulePane>
                <ModulePane label={AUGUR_STATUS_TITLE}>
                  <AugurStatus hideHeader={true} />
                </ModulePane>
              </ModuleTabs>
              <Favorites
                toggle={() =>
                  toggle('extendWatchlist', 'extendTransactions')
                }
              />
              <OpenMarkets
                toggle={() =>
                  toggle('extendNotifications', 'extendActiveMarkets')
                }
              />
              <Transactions />
              <TermsAndConditions />
            </div>
          ) : (
            <div
              className={classNames(Styles.AccountView, {
                [Styles.HideNotifications]: extendActiveMarkets,
                [Styles.HideTransactions]: extendWatchlist,
                [Styles.HideActiveMarkets]: extendNotifications,
              })}
            >
              <h1>My Account</h1>
              <Notifications />
              <OpenMarkets />
              <Overview hideHeader={false} />
              <AugurStatus hideHeader={false} />
              <Transactions />
              <Favorites />
              <MyMarkets />
              <TermsAndConditions />
            </div>
          )
        }
      </Media>
    </>
  );
};

export default AccountView;
