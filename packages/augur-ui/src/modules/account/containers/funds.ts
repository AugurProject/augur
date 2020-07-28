import { connect } from "react-redux";

import Funds from "modules/account/components/funds";
import { formatDaiPrice, formatDai } from "utils/format-number";
import {
  selectAccountFunds,
} from "modules/auth/selectors/login-account";
import { AppState } from "appStore";
import { updateModal } from "modules/modal/actions/update-modal";
import { MODAL_FROZEN_FUNDS } from "modules/common/constants";

const mapStateToProps = (state: AppState) => {
  const {
    totalAvailableTradingBalance,
    totalFrozenFunds,
    totalAccountValue,
  } = selectAccountFunds(state);

  return {
    totalFrozenFunds: formatDai(totalFrozenFunds, { removeComma: true }),
    totalAvailableTradingBalance: formatDai(totalAvailableTradingBalance, { removeComma: true }),
    totalAccountValue: formatDai(totalAccountValue, { removeComma: true }),
  };
};

const mapDispatchToProps = dispatch => ({
  frozenFundsModal: () => dispatch(updateModal({ type: MODAL_FROZEN_FUNDS })),
});

export default connect(mapStateToProps, mapDispatchToProps)(Funds);
