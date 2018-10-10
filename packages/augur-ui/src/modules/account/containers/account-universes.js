import { connect } from "react-redux";

import AccountUniverses from "modules/account/components/account-universes/account-universes";

import { loadUniverseInfo } from "modules/universe/actions/load-universe-info";
import { windowRef } from "src/utils/window-ref";

const mapStateToProps = state => ({
  address: state.loginAccount.address,
  universe: state.universe.id,
  winningChild: state.universe.winningChildUniverse
});

const mapDispatchToProps = dispatch => ({
  getUniverses: callback => dispatch(loadUniverseInfo(callback)),
  switchUniverse: universeId => {
    if (windowRef.localStorage && windowRef.localStorage.setItem) {
      windowRef.localStorage.setItem("selectedUniverse", universeId);
      location.reload();
    }
  }
});

const AccountUniversesContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AccountUniverses);

export default AccountUniversesContainer;
