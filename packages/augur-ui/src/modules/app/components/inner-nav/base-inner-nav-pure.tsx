import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import classNames from "classnames";
import { MOBILE_MENU_STATES } from "modules/common-elements/constants";
import Styles from "modules/app/components/inner-nav/inner-nav.styles";
import { isNull } from "lodash";
import MenuItem from "modules/app/components/inner-nav/menu-item";
import { XIcon, RotatableChevron } from "modules/common-elements/icons";

const BaseInnerNavPure = ({
  isMobile,
  menuItems = [],
  submenuItems = [],
  subMenuScalar,
  mobileMenuState,
  updateMobileMenuState
}) => {
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
        [Styles.AddMargins]: showSubMenu
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
        {submenuItems.filter(item => !isNull(item.label)).map(item => (
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
      </ul>
    </aside>
  );
};

BaseInnerNavPure.propTypes = {
  isMobile: PropTypes.bool.isRequired,
  mobileMenuState: PropTypes.number.isRequired,
  subMenuScalar: PropTypes.number.isRequired,
  menuItems: PropTypes.array.isRequired,
  submenuItems: PropTypes.array.isRequired,
  updateMobileMenuState: PropTypes.func.isRequired
};

export default BaseInnerNavPure;
