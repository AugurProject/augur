import React from 'react';
import Styles from 'modules/sidebar/sidebar.styles.less';
import { CloseIcon, GearIcon } from 'modules/common/icons';
import { useAppStatusStore } from 'modules/stores/app-status';
import { PrimaryButton, SecondaryButton } from 'modules/common/buttons';
import { RadioBarGroup } from 'modules/common/selection';
import { MARKETS, PORTFOLIO, SIDEBAR_TYPES } from 'modules/constants';
import Logo from 'modules/common/logo';
import classNames from 'classnames';
import makePath from 'modules/routes/helpers/make-path';
import parsePath from 'modules/routes/helpers/parse-path';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router';
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
    actions: { updateMarketsViewSettings },
  } = useAppStatusStore();
  const { categories, sortBy, reportingState, currency } = marketsViewSettings;
  return (
    <>
      <SideBarHeader header={'filters'} />
      <div className={Styles.Body}>
        <RadioBarGroup
          update={(value) => {
            updateMarketsViewSettings({ categories: value });
          }}
          title="categories"
          selected={categories}
          items={categoryItems}
        />
        <RadioBarGroup
          update={(value) => {
            updateMarketsViewSettings({ sortBy: value });
          }}
          title="sort by"
          selected={sortBy}
          items={sortByItems}
        />
        <RadioBarGroup
          title="market status"
          update={(value) => {
            updateMarketsViewSettings({ reportingState: value });
          }}
          selected={reportingState}
          items={marketStatusItems}
        />
        <RadioBarGroup
          title="currency"
          update={(value) => {
            updateMarketsViewSettings({ currency: value });
          }}
          selected={currency}
          items={currencyItems}
        />
      </div>
      <div className={Styles.Footer}>
        <PrimaryButton text="reset all" />
        <SecondaryButton text="apply filters" />
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
      <div className={Styles.NavigationFooter}>{GearIcon}</div>
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
