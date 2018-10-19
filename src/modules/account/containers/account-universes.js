import { connect } from "react-redux";

import AccountUniverses from "modules/account/components/account-universes/account-universes";

import { loadUniverseInfo } from "modules/universe/actions/load-universe-info";
import { updateUniverse } from "modules/universe/actions/update-universe";
import { setSelectedUniverse } from "../../auth/actions/selected-universe-management";

const mapStateToProps = state => ({
  address: state.loginAccount.address,
  universe: state.universe.id,
  winningChild: state.universe.winningChildUniverse
});

const mapDispatchToProps = dispatch => ({
  getUniverses: callback => dispatch(loadUniverseInfo(callback)),
  switchUniverse: id =>
    dispatch((_, getState) => {
      dispatch(updateUniverse({ id }));
      dispatch(setSelectedUniverse(id));
    })
});

const AccountUniversesContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AccountUniverses);

export default AccountUniversesContainer;
