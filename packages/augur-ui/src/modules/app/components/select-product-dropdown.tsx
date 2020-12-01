import React, { ReactElement, useEffect, useRef, useState } from 'react';
import Styles from './select-product-dropdown.styles.less';
import classNames from 'classnames';
import { DaiIcon, SelectProductIcon, StylizedEthIcon } from 'modules/common/icons';
import { useAppStatusStore } from 'modules/app/store/app-status';
import { THEMES } from 'modules/common/constants';
import makePath from 'modules/routes/helpers/make-path';
import { DISPUTING, REPORTING, CREATE_MARKET, MARKETS } from 'modules/routes/constants/views';
import { Link } from 'react-router-dom';
import ChevronFlip from 'modules/common/chevron-flip';

interface SelectProductDropdownProps {
  hideOnMobile?: boolean;
}

interface InnerDropdownOptions {
  action?: Function,
  icon: ReactElement,
  link?: string,
  title: string,
}

interface DropdownOptions {
  action?: Function;
  active?: boolean;
  dropdown?: InnerDropdownOptions[];
  dropdownStatus?: boolean;
  link?: string;
  title: string;
}

export const SelectProductDropdown = ({hideOnMobile}: SelectProductDropdownProps) => {
  const {
    currentBasePath,
    theme,
    isLogged,
    isProductSwitcherOpen,
    actions: {
      setTheme,
      setIsProductSwitcherOpen
    },
  } = useAppStatusStore();
  const [toggleAugurPro, setToggleAugurPro] = useState(false);
  const inputRef = useRef(null);

  const isTrading = theme === THEMES.TRADING;
  const isSportsbook = theme === THEMES.SPORTS;

  const handleClick = event => {
    if (inputRef.current.contains(event.target)) {
      return;
    }
    setIsProductSwitcherOpen(false);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClick, false);

    return () => {
      document.removeEventListener("mousedown", handleClick, false);
    }
  }, []);

  const isLoggedDropdownOptions: DropdownOptions[] = isLogged ? [{
    title: 'Create Market',
    link: makePath(CREATE_MARKET),
    active: currentBasePath === CREATE_MARKET,
    action: () => setTheme(THEMES.TRADING)
  }, {
    title: 'Disputing',
    link: makePath(DISPUTING),
    active: currentBasePath === DISPUTING,
    action: () => setTheme(THEMES.TRADING)
  }, {
    title: 'Reporting',
    link: makePath(REPORTING),
    active: currentBasePath === REPORTING,
    action: () => setTheme(THEMES.TRADING)
  }] : [];

  const isTradingOrSportsbook: DropdownOptions = isTrading ? {
    title: 'Sportsbook',
      link: makePath(MARKETS),
      action: () => {
        setTheme(THEMES.SPORTS);
      },
      active: isSportsbook
  } : isSportsbook ? {
    title: 'Trading',
      link: makePath(MARKETS),
      action: () => {
        setTheme(THEMES.TRADING);
      },
      active: isTrading
  } : null;

  const dropdownOptions: DropdownOptions[] = [{
    title: 'Augur Pro',
    action: () => setToggleAugurPro(!toggleAugurPro),
    dropdownStatus: toggleAugurPro,
    dropdown: [{
      title: 'DAI',
      action: () => {},
      link: null,
      icon: DaiIcon,
    }, {
      title: 'ETH',
      action: () => {},
      link: null,
      icon: StylizedEthIcon,
    }]
  }, {
    title: 'AMM',
    action: () => {},
  }, isTradingOrSportsbook,
    ...isLoggedDropdownOptions
  ];

  return (
    <div ref={inputRef} onClick={event => event.stopPropagation()} className={classNames(Styles.Dropdown, {
      [Styles.ShowDropdown]: isProductSwitcherOpen,
      [Styles.HideOnMobile]: hideOnMobile
    })}>
      <button onClick={() => setIsProductSwitcherOpen(!isProductSwitcherOpen)}>
        {SelectProductIcon}
        {!hideOnMobile && (
          <>
            <span>
              Products
            </span>
            <ChevronFlip
              pointDown={isProductSwitcherOpen}
              stroke="#fff"
              filledInIcon
              quick
            />
          </>
        )}
      </button>
      <div>
        <div>Products</div>
        {dropdownOptions.map(({title, action, link, dropdownStatus, dropdown, active}) => (
          <div key={title}>
            {link ? (
              <Link to={link} onClick={() => {
                action();
                !dropdown && setIsProductSwitcherOpen(false);
              }} className={classNames(Styles.Dropdown, {
                [Styles.Active]: active
              })}>{title}</Link>
            ) : (
              <button onClick={() => {
                action();
                !dropdown && setIsProductSwitcherOpen(false);
              }} className={classNames(Styles.Dropdown, {
                [Styles.Active]: active
              })}>
                {title}
                {dropdown && (
                  <ChevronFlip
                    pointDown={dropdownStatus}
                    stroke="#fff"
                    filledInIcon
                    quick
                  />
                )}
              </button>
            )}
            {dropdown && (
              <div className={classNames({
                [Styles.ShowInnerDropdown]: dropdownStatus
              })}>
                {dropdown.map(({title, action, link, icon}) => {
                  return link ? (
                    <Link to={link} key={title}>
                      <span>{icon}</span>
                      {title}
                    </Link>
                  ) : (
                    <button onClick={() => {
                      action();
                      setIsProductSwitcherOpen(false);
                    }} key={title}>
                      <span>{icon}</span>
                      {title}
                    </button>
                  )}
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
};
