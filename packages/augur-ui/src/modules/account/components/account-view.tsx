import React from 'react';
import Media from 'react-media';

import TermsAndConditions from 'modules/app/containers/terms-and-conditions';
import Notifications from 'modules/account/containers/notifications';
import Transactions from 'modules/account/containers/transactions';
import AugurStatus from 'modules/account/containers/augur-status';
import Favorites from 'modules/portfolio/containers/favorites';
import OpenMarkets from 'modules/account/containers/open-markets';
import Overview from 'modules/account/containers/overview';
import ModuleTabs from 'modules/market/components/common/module-tabs/module-tabs';
import ModulePane from 'modules/market/components/common/module-tabs/module-pane';
import {
  SMALL_MOBILE,
  YOUR_OVERVIEW_TITLE,
  AUGUR_STATUS_TITLE,
} from 'modules/common/constants';

import Styles from 'modules/account/components/account-view.styles.less';
import classNames from 'classnames';
export interface AccountViewProps {
  newNotifications?: boolean;
  isLogged: boolean;
}

interface AccountViewState {
  extendNotifications: boolean;
  extendActiveMarkets: boolean;
  extendWatchlist: boolean;
  extendTransactions: boolean;
}

export default class AccountView extends React.Component<
  AccountViewProps,
  AccountViewState
> {
  state: AccountViewState = {
    extendNotifications: false,
    extendActiveMarkets: false,
    extendWatchlist: false,
    extendTransactions: false,
  };

  toggle = (extend: string, hide: string) => {
    if (!this.state[extend] && this.state[hide]) {
      this.setState({ [extend]: false, [hide]: false });
    } else {
      this.setState({
        [extend]: !this.state[extend],
        [hide]: false,
      });
    }
  };

  render() {
    const s = this.state;
    return (
      <>
        <Media query={SMALL_MOBILE}>
          {matches =>
            matches ? (
              <ModuleTabs selected={0} fillWidth noBorder>
                <ModulePane label={YOUR_OVERVIEW_TITLE}>
                  <Overview />
                </ModulePane>
                <ModulePane
                  label="Notifications"
                  isNew={this.props.newNotifications}
                >
                  <Notifications />
                </ModulePane>
                <ModulePane label="Watchlist">
                  <Favorites />
                </ModulePane>
                <ModulePane label="My Active Markets">
                  <OpenMarkets />
                </ModulePane>
                <ModulePane label={AUGUR_STATUS_TITLE}>
                  <AugurStatus />
                </ModulePane>
                <ModulePane label="Transactions">
                  <Transactions />
                </ModulePane>
              </ModuleTabs>
            ) : (
              <div
                className={classNames(Styles.AccountView, {
                  [Styles.HideNotifications]: s.extendActiveMarkets,
                  [Styles.HideTransactions]: s.extendWatchlist,
                  [Styles.HideActiveMarkets]: s.extendNotifications,
                })}
              >
                <div>
                  <div>
                    <Notifications
                      toggle={() =>
                        this.toggle(
                          'extendNotifications',
                          'extendActiveMarkets'
                        )
                      }
                    />
                    <OpenMarkets
                      toggle={() =>
                        this.toggle(
                          'extendActiveMarkets',
                          'extendNotifications'
                        )
                      }
                    />
                  </div>
                  <div>
                    <ModuleTabs selected={0}>
                      <ModulePane label={YOUR_OVERVIEW_TITLE}>
                        <Overview />
                      </ModulePane>
                      <ModulePane label={AUGUR_STATUS_TITLE}>
                        <AugurStatus />
                      </ModulePane>
                    </ModuleTabs>
                  </div>
                  <div>
                    <Favorites
                      toggle={() =>
                        this.toggle('extendWatchlist', 'extendTransactions')
                      }
                    />
                    { this.props.isLogged && <Transactions /> }
                  </div>
                </div>
                <TermsAndConditions />
              </div>
            )
          }
        </Media>
      </>
    );
  }
}
