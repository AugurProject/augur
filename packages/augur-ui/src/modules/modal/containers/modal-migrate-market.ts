import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { ModalMigrateMarket } from 'modules/modal/components/modal-migrate-market';
import { migrateMarketThroughOneFork } from 'modules/forking/actions/migrate-market-through-one-fork';
import { closeModal } from 'modules/modal/actions/close-modal';
import { AppState } from 'store';
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
  gasCost: formatGasCostToEther(
    MIGRATE_MARKET_GAS_ESTIMATE.toFixed(),
    { decimalsRounded: 4 },
    getGasPrice(state)
  )
});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => dispatch(closeModal()),
  migrateMarketThroughOneFork: (marketId, estimateGas, callback) =>
    dispatch(migrateMarketThroughOneFork(marketId, estimateGas, callback)),
});

const mergeProps = (sP: any, dP: any, oP: any) => {
  const gasCost = sP.gasCost;
  return {
    title: 'Migrate Market',
    description: ['This market will be migrated to the winning universe and will no longer be viewable in the current universe.'],
    marketId: sP.modal.marketId,
    marketTitle: sP.modal.market.description,
    type: sP.modal.marketType,
    closeModal: () => dP.closeModal(),
    migrateMarketThroughOneFork: (marketId, estimateGas, callback) => {
      dP.migrateMarketThroughOneFork(marketId, estimateGas, callback)
    },
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
          dP.migrateMarketThroughOneFork();
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
