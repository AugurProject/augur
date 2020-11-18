import React, { useEffect, useRef, useState } from 'react';
import Styles from './select-product-dropdown.styles.less';
import classNames from 'classnames';
import { DaiIcon, SelectProductIcon, StylizedEthIcon } from 'modules/common/icons';
import { useAppStatusStore } from 'modules/app/store/app-status';
import { THEMES } from 'modules/common/constants';
import makePath from 'modules/routes/helpers/make-path';
import { DISPUTING, REPORTING, CREATE_MARKET } from 'modules/routes/constants/views';
import { Link } from 'react-router-dom';
import ChevronFlip from 'modules/common/chevron-flip';

export const SelectProductDropdown = () => {
  const {
    actions: { setTheme },
  } = useAppStatusStore();
  const [toggleDropdown, setToggleDropdown] = useState(false);
  const [toggleAugurPro, setToggleAugurPro] = useState(false);

  const dropdownOptions = [{
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
  }, {
    title: 'Sportsbook',
    action: () => setTheme(THEMES.SPORTS),
  }, {
    title: 'Create Market',
    action: () => {},
    link: makePath(CREATE_MARKET)
  }, {
    title: 'Disputing',
    link: makePath(DISPUTING),
  }, {
    title: 'Reporting',
    link: makePath(REPORTING),
  }];

  const inputRef = useRef();

  const handleClick = event => {
    if (inputRef.current.contains(event.target)) {
      return;
    }
    setToggleDropdown(false);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClick, false);

    return () => {
      document.removeEventListener("mousedown", handleClick, false);
    }
  }, []);

  return (
    <div ref={inputRef} className={classNames(Styles.Dropdown, {
      [Styles.ShowDropdown]: toggleDropdown
    })}>
      <button onClick={() => setToggleDropdown(!toggleDropdown)}>
        {SelectProductIcon}
      </button>
      <div>
        <div>Products</div>
        {dropdownOptions.map(({title, action, link, dropdownStatus, dropdown}) => (
          <div key={title}>
            {link ? (
              <Link to={link}>{title}</Link>
            ) : (
              <button onClick={() => action()}>
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
                    <button onClick={() => action()} key={title}>
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
