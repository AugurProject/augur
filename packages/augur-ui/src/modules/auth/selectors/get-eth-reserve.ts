import { createSelector } from "reselect";
import { createBigNumber } from "utils/create-big-number";
import { selectLoginAccount } from "./login-account";
import { formatAttoEth, formatEther } from "utils/format-number";
import { FormattedNumber } from "modules/types";
import { DESIRED_SIGNER_ETH_BALANCE } from 'contract-dependencies-gsn/src/ContractDependenciesGSN';
import { AppStatus } from "modules/app/store/app-status";

export const getEthReserve = createSelector(
  selectLoginAccount,
  loginAccount => {
    const { loginAccount: { balances } } = AppStatus.get();
    const ethNonSafeBN = createBigNumber(balances.ethNonSafe);
    let desiredSignerEthBalance = createBigNumber(formatAttoEth(Number(DESIRED_SIGNER_ETH_BALANCE)).value);
    if (ethNonSafeBN.lt(desiredSignerEthBalance)) desiredSignerEthBalance = ethNonSafeBN;
    const reserveEthAmount: FormattedNumber = formatEther(desiredSignerEthBalance, {
      zeroStyled: false,
      decimalsRounded: 4,
    });
    return reserveEthAmount;
  }
);
