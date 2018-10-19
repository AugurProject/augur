import React from "react";
import PropTypes from "prop-types";
import LoadingLogo from "modules/app/components/loading-logo/loading-logo";
import Styles from "modules/app/components/logo/logo.styles";

const Logo = ({ isLoading }) => (
  <section className={Styles.Logo}>
    <LoadingLogo isLoading={isLoading} />
  </section>
);

Logo.propTypes = {
  isLoading: PropTypes.bool.isRequired
};
export default Logo;
