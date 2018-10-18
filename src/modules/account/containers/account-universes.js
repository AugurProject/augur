import { connect } from "react-redux";

import AccountUniverses from "modules/account/components/account-universes/account-universes";

import { loadUniverseInfo } from "modules/universe/actions/load-universe-info";
import { updateUniverse } from "modules/universe/actions/update-universe";
import { windowRef } from "src/utils/window-ref";

const mapStateToProps = state => ({
  address: state.loginAccount.address,
  universe: state.universe.id,
  winningChild: state.universe.winningChildUniverse
});

const mapDispatchToProps = dispatch => ({
  getUniverses: callback => dispatch(loadUniverseInfo(callback)),
  switchUniverse: id =>
    dispatch((_, getState) => {
      const { loginAccount, connection } = getState();
      const { address } = loginAccount;
      const { augurNodeNetworkId } = connection;
      dispatch(updateUniverse({ id }));
      if (windowRef && windowRef.localStorage) {
        const { localStorage } = windowRef;
        const accountStorage = JSON.parse(localStorage.getItem(address));
        if (accountStorage) {
          localStorage.setItem(
            address,
            JSON.stringify({
              ...accountStorage,
              selectedUniverse: {
                ...accountStorage.selectedUniverse,
                [augurNodeNetworkId]: id
              }
            })
          );
        }
      }
    })
});

const AccountUniversesContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AccountUniverses);

export default AccountUniversesContainer;
