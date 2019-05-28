import BaseInnerNav from "modules/app/components/inner-nav/base-inner-nav";
import { getNetworkId } from "modules/contracts/actions/contractCalls";
import { augur } from "services/augurjs";

import {
  ACCOUNT_DEPOSIT,
  ACCOUNT_WITHDRAW,
  ACCOUNT_REP_FAUCET,
  ACCOUNT_UNIVERSES
} from "modules/routes/constants/views";

export default class AccountInnerNav extends BaseInnerNav {
  static propTypes = {
    ...BaseInnerNav.propTypes
  };

  getMainMenuData() {
    const showRepFaucet = getNetworkId() !== 1;
    const { currentBasePath } = this.props;
    return [
      {
        label: "Deposit",
        visible: true,
        isSelected: currentBasePath === ACCOUNT_DEPOSIT,
        link: {
          pathname: ACCOUNT_DEPOSIT
        }
      },
      {
        label: "Withdraw",
        visible: true,
        isSelected: currentBasePath === ACCOUNT_WITHDRAW,
        link: {
          pathname: ACCOUNT_WITHDRAW
        }
      },
      {
        label: "REP Faucet",
        visible: showRepFaucet,
        isSelected: currentBasePath === ACCOUNT_REP_FAUCET,
        link: {
          pathname: ACCOUNT_REP_FAUCET
        }
      },
      {
        label: "Universes",
        visible: true,
        isSelected: currentBasePath === ACCOUNT_UNIVERSES,
        link: {
          pathname: ACCOUNT_UNIVERSES
        }
      }
    ];
  }
}
