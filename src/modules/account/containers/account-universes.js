import { connect } from "react-redux";

import AccountUniverses from "modules/account/components/account-universes/account-universes";

import { loadUniverseInfo } from "modules/universe/actions/load-universe-info";
import { setSelectedUniverse } from "modules/auth/actions/selected-universe-management";
import { loadUniverse } from "modules/app/actions/load-universe";
import { windowRef } from "utils/window-ref";

const mapStateToProps = state => ({
  address: state.loginAccount.address,
  universe: state.universe.id,
  winningChild: state.universe.winningChildUniverse
});

const mapDispatchToProps = dispatch => ({
  getUniverses: callback => dispatch(loadUniverseInfo(callback)),
  switchUniverse: id =>
    dispatch((_, getState) => {
      dispatch(setSelectedUniverse(id));
      // incase there is no window, we loadUniverse to update state.
      dispatch(loadUniverse(id));
      // if there is a windowRef just reload.
      windowRef.location.reload();
    })
});

const AccountUniversesContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AccountUniverses);

export default AccountUniversesContainer;
