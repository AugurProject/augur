import * as React from "react";
import Styles from 'modules/app/components/app.styles.less';
import TermsAndConditions from "./terms-and-conditions";

const Footer = () => {
  const version = process.env.CURRENT_VERSION || `testing`;
  return (
    <footer className={Styles.Footer}>
      <div>Augur version: <span>{version}</span></div>
      <TermsAndConditions />
    </footer>
  )
};

export default Footer;
