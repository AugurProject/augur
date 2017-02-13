import { augur, utils } from '../../../services/augurjs';
import { updateLoginAccount } from '../../auth/actions/update-login-account';

export const registerTimestamp = () => (dispatch, getState) => (
  augur.Register.register(utils.noop, r => dispatch(updateLoginAccount({
    registerBlockNumber: r.blockNumber
  })), e => e && console.error(e))
);
