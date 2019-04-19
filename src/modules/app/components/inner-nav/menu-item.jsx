import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import Styles from "modules/app/components/inner-nav/inner-nav.styles";

const MenuItem = ({ isSelected, visible, seperator, children }) => (
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

MenuItem.propTypes = {
  isSelected: PropTypes.bool.isRequired,
  visible: PropTypes.bool.isRequired,
  seperator: PropTypes.bool,
  children: PropTypes.array
};

MenuItem.defaultProps = {
  children: null,
  seperator: false
};

export default MenuItem;
