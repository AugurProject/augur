import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

const NavReportingIcon = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    className={classNames("nav-reporting-icon", { [className]: className })}
  >
    <g
      id="Symbols"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g id="Icon/Reporting" stroke="#FFFFFF">
        <polyline
          id="Page-1"
          points="1 13.1237033 9.63049725 19.4302343 23 5"
        />
      </g>
    </g>
  </svg>
);

export default NavReportingIcon;

NavReportingIcon.propTypes = {
  className: PropTypes.string
};

NavReportingIcon.defaultProps = {
  className: null
};
