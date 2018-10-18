import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import Styles from "modules/app/components/inner-nav/inner-nav.styles";

const MenuItem = ({ isSelected, visible, children }) => (
  <li
    className={classNames({
      [Styles["InnerNav__menu-item"]]: true,
      [Styles["InnerNav__menu-item--selected"]]: isSelected,
      [Styles["InnerNav__menu-item--visible"]]: visible
    })}
  >
    {children}
  </li>
);

MenuItem.propTypes = {
  isSelected: PropTypes.bool.isRequired,
  visible: PropTypes.bool.isRequired,
  children: PropTypes.array
};

MenuItem.defaultProps = {
  children: null
};

export default MenuItem;
