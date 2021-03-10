import React, { useState } from 'react';
import Styles from './sidebar.styles.less';
import { useAppStatusStore } from '../stores/app-status';
import Logo from '../common/logo';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router';
import { SettingsButton } from '../common/top-nav';
import { Constants, PathUtils, Components } from '@augurproject/augur-comps';
const {
  MARKETS,
  PORTFOLIO,
  SIDEBAR_TYPES,
  DEFAULT_MARKET_VIEW_SETTINGS,
  categoryItems,
  currencyItems,
  marketStatusItems,
  sortByItems,
} = Constants;
const {
  SelectionComps: { RadioBarGroup },
  Icons: { CloseIcon },
  ButtonComps: { PrimaryButton, SecondaryButton },
} = Components;
const { makePath, parsePath } = PathUtils;

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
  const filtersAreReset =
    JSON.stringify(localSettings) ===
    JSON.stringify(DEFAULT_MARKET_VIEW_SETTINGS);

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
          disabled={filtersAreReset}
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
    isLogged,
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
          {isLogged && (
            <li className={classNames({ [Styles.Active]: path === PORTFOLIO })}>
              <Link onClick={() => setSidebar(null)} to={makePath(PORTFOLIO)}>
                Portfolio
              </Link>
            </li>
          )}
        </ol>
      </div>
      <div className={Styles.NavigationFooter}>
        <SettingsButton />
      </div>
    </>
  );
};

export const Sidebar = () => {
  const { sidebarType } = useAppStatusStore();
  return (
    <div
      className={Styles.Sidebar}
    >
      {sidebarType === SIDEBAR_TYPES.FILTERS && <FilterSideBar />}
      {sidebarType === SIDEBAR_TYPES.NAVIGATION && <NavigationSideBar />}
    </div>
  );
};
