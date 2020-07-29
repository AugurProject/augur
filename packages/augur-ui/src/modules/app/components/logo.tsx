import React from "react";
import { AugurLogoWithText } from "modules/common/icons";
import Styles from "modules/app/components/logo.styles";

const Logo = () => (
  <section className={Styles.Logo}>
    {AugurLogoWithText}
  </section>
);

export default Logo;
