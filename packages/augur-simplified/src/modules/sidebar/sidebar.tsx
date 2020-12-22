import React from 'react';
import Styles from 'modules/sidebar/sidebar.styles.less';
import { CloseIcon, GearIcon } from 'modules/common/icons';
import { useAppStatusStore } from 'modules/stores/app-status';
import { PrimaryButton, SecondaryButton } from 'modules/common/buttons';
import { CheckboxGroup, RadioBarGroup } from 'modules/common/selection';
import { MARKETS, PORTFOLIO, SIDEBAR_TYPES } from 'modules/constants';
import Logo from 'modules/common/logo';
import classNames from 'classnames';
import makePath from 'modules/routes/helpers/make-path';
import parsePath from 'modules/routes/helpers/parse-path';
import { Link, useLocation } from 'react-router-dom';

const categoryItems = [
  {
    label: 'All',
    value: 'All',
    selected: true,
  },
  {
    label: 'Crypto',
    value: 'Crypto',
  },
  {
    label: 'Economics',
    value: 'Economics',
  },
  {
    label: 'Entertainment',
    value: 'Entertainment',
  },
  {
    label: 'Medical',
    value: 'Medical',
  },
  {
    label: 'Sports',
    value: 'Sports',
  },
  {
    label: 'Other',
    value: 'Other',
  },
];

const sortByItems = [
  {
    label: 'Total Volume',
    value: 'Total Volume',
    selected: true,
  },
  {
    label: '24hr volume',
    value: '24hr volume',
  },
  {
    label: 'liquidity',
    value: 'liquidity',
  },
  {
    label: 'ending soon',
    value: 'ending soon',
  },
];

const marketStatusItems = [
  {
    label: 'Open',
    value: 'Open',
    selected: true,
  },
  {
    label: 'In Settlement',
    value: 'In Settlement',
  },
  {
    label: 'Finalised',
    value: 'Finalised',
  },
];

const currencyItems = [
  {
    label: 'All',
    value: 'All',
    selected: true,
  },
  {
    label: 'ETH',
    value: 'ETH',
  },
  {
    label: 'USDC',
    value: 'USDC',
  },
];

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
  return (
    <>
      <SideBarHeader header={'filters'} />
      <div className={Styles.Body}>
        <CheckboxGroup title="categories" items={categoryItems} />
        <RadioBarGroup title="sort by" items={sortByItems} />
        <CheckboxGroup title="market status" items={marketStatusItems} />
        <CheckboxGroup title="currency" items={currencyItems} />
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
