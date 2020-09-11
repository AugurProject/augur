import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { ModalStaking } from 'modules/modal/components/modal-staking';
import { stakeTokens } from 'modules/reporting/actions/participation-tokens-management';
import { closeModal } from 'modules/modal/actions/close-modal';
import { AppState } from 'appStore';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { getTransactionLabel } from 'modules/auth/selectors/get-gas-price';
import { REP, SREP } from 'modules/common/constants';
import { stakeInFeePool } from 'modules/contracts/actions/contractCalls';

const mapStateToProps = (state: AppState, ownProps) => {
  const tokenName = ownProps.modal.tokenName ? ownProps.modal.tokenName : 'REP';
  const tokenBalance = ownProps.modal.balance;
  return {
    modal: state.modal,
    tokenBalance,
    tokenName,
    gasPrice: state.gasPriceInfo.userDefinedGasPrice || state.gasPriceInfo.average,
    ethToDaiRate: state.appStatus.ethToDaiRate,
    messages: [
      {
        key: 'quant',
        preText: 'Quantity',
      },
    ],
    title: `Stake ${tokenName}`,
    transactionLabel: getTransactionLabel(state),
  }
};

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => dispatch(closeModal()),
});


const mergeProps = (sP: any, dP: any, oP: any) => {
  let stakeTokens = async (amount) => await stakeInFeePool(amount);
  if (sP.tokenName === SREP) {
    stakeTokens = async (amount) => {
      console.log('wire up governance staking', amount);
    }
  }

  return {
    ...sP,
    ...dP,
    ...oP,
    stakeTokens,
  }
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
  )(ModalStaking)
);
