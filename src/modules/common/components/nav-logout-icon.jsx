import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

const NavLogoutIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 18 18"
    className={classNames("nav-logout-icon", { [className]: className })}
  >
    <g fill="#FFF" fillRule="nonzero">
      <path d="M14.16 10.123H5.624a1.125 1.125 0 0 1 0-2.25h8.534l-1.454-1.455a1.125 1.125 0 0 1 1.59-1.59l3.375 3.374a1.125 1.125 0 0 1 0 1.591l-3.375 3.375a1.125 1.125 0 1 1-1.59-1.59l1.454-1.455z" />
      <path d="M9 15.5v-2a1 1 0 0 1 2 0v4H0V0h11v4a1 1 0 0 1-2 0V2H2v13.5h7z" />
    </g>
  </svg>
);

export default NavLogoutIcon;

NavLogoutIcon.propTypes = {
  className: PropTypes.string
};

NavLogoutIcon.defaultProps = {
  className: null
};
