import React from "react";
import classNames from "classnames";

import Styles from "modules/app/components/inner-nav/inner-nav.styles.less";

interface MenuItemProps {
  isSelected: Boolean;
  visible: Boolean;
  seperator?: Boolean;
  children?: Array<React.Component> | null;
}

const MenuItem = ({ isSelected, visible, seperator, children }: MenuItemProps) => (
  <>
    {seperator && <span className={Styles["InnerNav__menu-item--seperator"]} />}
    <li
      className={classNames({
        [Styles["InnerNav__menu-item"]]: true,
        [Styles["InnerNav__menu-item--selected"]]: isSelected,
        [Styles["InnerNav__menu-item--visible"]]: visible
      })}
    >
      {children}
    </li>
  </>
);

MenuItem.defaultProps = {
  children: null,
  seperator: false
};

export default MenuItem;
