import React from "react";
import PropTypes from "prop-types";
import TextFit from "react-textfit";

import Styles from "modules/account/components/account-header/account-header.styles";

const AccountHeader = p => {
  // assign defaults incase we have nulls for value
  const ethValue = p.stats[0].totalRealEth.value.formatted;
  const repValue = p.stats[0].totalRep.value.formatted;

  return (
    <TextFit mode="single" min={16} max={90}>
      <div className={Styles.AccountHeader}>
        <div className={Styles.AccountHeader__Currency}>
          <span className="eth_value"> {ethValue} </span>
          <span className={Styles["AccountHeader__Currency-label"]}>
            {p.stats[0].totalRealEth.label}
          </span>
        </div>
        <div className={Styles.AccountHeader__Currency}>
          <span className="rep_value"> {repValue} </span>
          <span className={Styles["AccountHeader__Currency-label"]}>
            {p.stats[0].totalRep.label}
          </span>
        </div>
      </div>
    </TextFit>
  );
};

AccountHeader.propTypes = {
  stats: PropTypes.array.isRequired
};

export default AccountHeader;
