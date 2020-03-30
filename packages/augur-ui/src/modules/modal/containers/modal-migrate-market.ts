import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { ModalMigrateMarket } from 'modules/modal/components/modal-migrate-market';
import { migrateMarketThroughOneFork } from 'modules/forking/actions/migrate-through-one-fork';
import { closeModal } from 'modules/modal/actions/close-modal';
import { AppState } from 'appStore';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { formatGasCostToEther, formatEther } from 'utils/format-number';
import {
  MIGRATE_MARKET_GAS_ESTIMATE,
} from 'modules/common/constants';
import { DISMISSABLE_NOTICE_BUTTON_TYPES } from 'modules/reporting/common';
import { getGasPrice } from 'modules/auth/selectors/get-gas-price';

const mapStateToProps = (state: AppState) => ({
  modal: state.modal,
  // TODO: Replace MIGRATE_MARKET_GAS_ESTIMATE with call to `migrateMarketThroughOneFork` with `estimateGas` set to true
  gasCost: formatGasCostToEther(
    MIGRATE_MARKET_GAS_ESTIMATE.toFixed(),
    { decimalsRounded: 4 },
    getGasPrice(state)
  )
});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => dispatch(closeModal()),
  migrateMarketThroughOneFork: (marketId, payoutNumerators, description, estimateGas, callback) =>
    dispatch(migrateMarketThroughOneFork(marketId, payoutNumerators, description, estimateGas, callback)),
});

const mergeProps = (sP: any, dP: any, oP: any) => {
  const gasCost = sP.gasCost;
  const marketId = sP.modal.market.id;
  const payoutNumerators = [];
  const description = '';
  const estimateGas = false;
  const migrateMarketThroughOneFork = () => {
    dP.migrateMarketThroughOneFork(marketId, payoutNumerators, description, estimateGas)
  };
  return {
    title: 'Migrate Market',
    description: ['This market will be migrated to the winning universe and will no longer be viewable in the current universe.'],
    marketId: sP.modal.market.id,
    marketTitle: sP.modal.market.description,
    type: sP.modal.marketType,
    closeModal: () => dP.closeModal(),

    breakdown: [
      {
        label: 'Total Gas Cost (Est)',
        // @ts-ignore
        value: formatEther(gasCost).full,
      },
    ],
    dismissableNotice: {
      title: 'You may need to sign multiple transactions',
      buttonType: DISMISSABLE_NOTICE_BUTTON_TYPES.CLOSE,
      show: true,
    },
    buttons: [
      {
        text: 'Migrate Market',
        action: () => {
          migrateMarketThroughOneFork();
          dP.closeModal();
        },
      },
      {
        text: 'Close',
        action: () => dP.closeModal(),
      },
    ],
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
  )(ModalMigrateMarket)
);
