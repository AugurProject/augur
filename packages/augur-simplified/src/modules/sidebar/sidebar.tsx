import React, { useState } from 'react';
import Styles from 'modules/sidebar/sidebar.styles.less';
import { CloseIcon } from 'modules/common/icons';
import { useAppStatusStore } from 'modules/stores/app-status';
import { PrimaryButton, SecondaryButton } from 'modules/common/buttons';
import { RadioBarGroup } from 'modules/common/selection';
import {MARKETS, PORTFOLIO, SIDEBAR_TYPES, DEFAULT_MARKET_VIEW_SETTINGS} from 'modules/constants';
import Logo from 'modules/common/logo';
import classNames from 'classnames';
import makePath from 'modules/routes/helpers/make-path';
import parsePath from 'modules/routes/helpers/parse-path';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router';
import { SettingsButton } from 'modules/common/top-nav';
import {
  categoryItems,
  currencyItems,
  marketStatusItems,
  sortByItems,
} from 'modules/constants';


interface SideBarHeaderProps {
  header?: string;
  showLogo?: boolean;
}
const SideBarHeader = ({ header, showLogo }: SideBarHeaderProps) => {
  const {
    actions: { setSidebar },
  } = useAppStatusStore();
  return (
    <div className={Styles.Header}>
      {showLogo && <Logo />}
      <span>{header}</span>
      <span onClick={() => setSidebar(null)}>{CloseIcon}</span>
    </div>
  );
};

const FilterSideBar = () => {
  const {
    marketsViewSettings,
    actions: { updateMarketsViewSettings, setSidebar },
  } = useAppStatusStore();
  const [localSettings, setLocalSettings] = useState(marketsViewSettings);
  const filtersAreResetted = JSON.stringify(localSettings) === JSON.stringify(DEFAULT_MARKET_VIEW_SETTINGS);

  return (
    <>
      <SideBarHeader header={'filters'} />
      <div className={Styles.Body}>
        <RadioBarGroup
          update={(value) => {
            setLocalSettings({ ...localSettings, categories: value });
          }}
          title="categories"
          selected={localSettings.categories}
          items={categoryItems}
        />
        <RadioBarGroup
          update={(value) => {
            setLocalSettings({ ...localSettings, sortBy: value });
          }}
          title="sort by"
          selected={localSettings.sortBy}
          items={sortByItems}
        />
        <RadioBarGroup
          title="market status"
          update={(value) => {
            setLocalSettings({ ...localSettings, reportingState: value });
          }}
          selected={localSettings.reportingState}
          items={marketStatusItems}
        />
        <RadioBarGroup
          title="currency"
          update={(value) => {
            setLocalSettings({ ...localSettings, currency: value });
          }}
          selected={localSettings.currency}
          items={currencyItems}
        />
      </div>
      <div className={Styles.Footer}>
        <SecondaryButton
          text="reset all"
          action={() => {
            setLocalSettings(DEFAULT_MARKET_VIEW_SETTINGS);
          }}
          disabled={filtersAreResetted}
        />
        <PrimaryButton
          text="apply filters"
          action={() => {
            updateMarketsViewSettings({
              categories: localSettings.categories,
              sortBy: localSettings.sortBy,
              reportingState: localSettings.reportingState,
              currency: localSettings.currency,
            });
            setSidebar(null);
          }}
        />
      </div>
    </>
  );
};

const NavigationSideBar = () => {
  const {
    actions: { setSidebar },
  } = useAppStatusStore();
  const location = useLocation();
  const path = parsePath(location.pathname)[0];
  return (
    <>
      <SideBarHeader showLogo />
      <div className={Styles.Body}>
        <ol>
          <li className={classNames({ [Styles.Active]: path === MARKETS })}>
            <Link onClick={() => setSidebar(null)} to={makePath(MARKETS)}>
              Markets
            </Link>
          </li>
          <li className={classNames({ [Styles.Active]: path === PORTFOLIO })}>
            <Link onClick={() => setSidebar(null)} to={makePath(PORTFOLIO)}>
              Portfolio
            </Link>
          </li>
        </ol>
      </div>
      <div className={Styles.NavigationFooter}><SettingsButton /></div>
    </>
  );
};

export const Sidebar = () => {
  const { sidebarType } = useAppStatusStore();
  return (
    <div className={Styles.Sidebar}>
      {sidebarType === SIDEBAR_TYPES.FILTERS && <FilterSideBar />}
      {sidebarType === SIDEBAR_TYPES.NAVIGATION && <NavigationSideBar />}
    </div>
  );
};
