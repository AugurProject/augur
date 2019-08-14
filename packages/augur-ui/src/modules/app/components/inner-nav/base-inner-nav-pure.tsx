import React from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";
import { MOBILE_MENU_STATES } from "modules/common/constants";
import MenuItem from "modules/app/components/inner-nav/menu-item";
import { XIcon, RotatableChevron } from "modules/common/icons";
import MarketsListFilters from "modules/app/containers/markets-list-filters";

import Styles from "modules/app/components/inner-nav/inner-nav.styles.less";

interface MenuItemInterface {
  label: string;
  value: string;
  description?: string;
}

interface BaseInnerNavPureProps {
  isMobile: boolean;
  mobileMenuState: number;
  subMenuScalar: number;
  menuItems: MenuItemInterface[];
  submenuItems: MenuItemInterface[];
  updateMobileMenuState: Function;
};

const BaseInnerNavPure = ({
  isMobile,
  menuItems = [],
  submenuItems = [],
  subMenuScalar,
  mobileMenuState,
  updateMobileMenuState,
}: BaseInnerNavPureProps) => {
  const showMainMenu = mobileMenuState >= MOBILE_MENU_STATES.FIRSTMENU_OPEN;
  const showSubMenu = mobileMenuState === MOBILE_MENU_STATES.SUBMENU_OPEN;

  let subMenuAnimatedStyle;
  if (!isMobile) {
    subMenuAnimatedStyle = { left: 110 * subMenuScalar };
  }

  const DataToItem = item => (
    <MenuItem
      isSelected={item.isSelected}
      visible={item.visible}
      seperator={item.seperator}
    >
      {item.link && (
        <Link to={item.link} onClick={item.onClick} title={item.label}>
          {item.label}
        </Link>
      )}
      {!item.link && (
        <button
          onClick={item.onClick}
          className={item.label}
          title={item.label.toUpperCase()}
        >
          {item.label}
        </button>
      )}
    </MenuItem>
  );
  return (
    <aside
      className={classNames(Styles.InnerNav, {
        [Styles.mobileShow]: showMainMenu,
      })}
    >
      {showMainMenu && (
        <div className={classNames({ [Styles.SubMenuShow]: showSubMenu })}>
          <button
            onClick={() =>
              updateMobileMenuState(MOBILE_MENU_STATES.FIRSTMENU_OPEN)
            }
          >
            {RotatableChevron}
          </button>
          <button
            onClick={() => updateMobileMenuState(MOBILE_MENU_STATES.CLOSED)}
          >
            {XIcon}
          </button>
        </div>
      )}
      <ul
        className={classNames(
          Styles.InnerNav__menu,
          Styles["InnerNav__menu--submenu"],
          { [Styles["InnerNav__menu--submenu--mobileshow"]]: showSubMenu }
        )}
        style={subMenuAnimatedStyle}
      >
        {submenuItems.filter(item => item.label !== null).map(item => (
          <DataToItem key={item.label} {...item} />
        ))}
      </ul>
      <ul
        className={classNames(
          Styles.InnerNav__menu,
          Styles["InnerNav__menu--main"]
        )}
      >
        {menuItems.map(item => (
          <DataToItem key={item.label} {...item} />
        ))}

        <MarketsListFilters />
      </ul>
    </aside>
  );
};

export default BaseInnerNavPure;
