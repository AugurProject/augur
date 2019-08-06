import React from "react";
import classNames from "classnames";
import { Error } from 'modules/common/form';
import { FormattedNumber } from "modules/types";
import Styles from "modules/create-market/components/no-funds-error.styles.less";

export interface NoFundsErrorsProps {
  noEth: boolean;
  noRep: boolean;
  noDai: boolean;
  totalEth: FormattedNumber;
  totalRep: FormattedNumber;
  totalDai: FormattedNumber;
  availableEthFormatted: FormattedNumber;
  availableRepFormatted: FormattedNumber;
  availableDaiFormatted: FormattedNumber;
}
export const NoFundsErrors = (props: NoFundsErrorsProps) => {
  const {
    noEth,
    noRep,
    noDai,
    totalEth,
    totalRep,
    totalDai,
    availableEthFormatted,
    availableRepFormatted,
    availableDaiFormatted,
  } = props;

  return (
    <div className={classNames({[Styles.HasError]: noEth || noDai || noRep})}>
      {noEth && (
        <Error
          alternate
          header="Not enough ETH in your wallet"
          subheader={
            `You have ${availableEthFormatted.formatted} ETH of ${totalEth.formatted} required to create this market`
          }
        />
      )}
      {noRep && (
        <Error
          alternate
          header="Not enough REP in your wallet"
          subheader={
            `You have ${availableRepFormatted.formatted} V2 REP of ${totalRep.formatted} required to create this market.`
          }
        />
      )}
      {noDai && (
        <Error
          alternate
          header="Not enough $ (DAI) in your wallet"
          subheader={
            `You have $${availableDaiFormatted.formatted} (DAI) of $${totalDai.formatted} (DAI) required to create this market`
          }
        />
      )}
    </div>
  );
};
