import * as LEDGER_STATES from 'modules/auth/constants/ledger-status'
import { MODAL_LEDGER } from 'modules/modal/constants/modal-types'
import { updateModal } from 'modules/modal/actions/update-modal'
import { updateLedgerStatus } from 'modules/auth/actions/update-ledger-status'

export function onConnectLedgerRequest() {
  return (dispatch, getState) => {
    dispatch(updateLedgerStatus(LEDGER_STATES.CONNECT_LEDGER))
  }
}


export function onOpenEthereumAppRequest() {
  return (dispatch, getState) => {
    dispatch(updateLedgerStatus(LEDGER_STATES.OPEN_APP))
  }
}

export function onSwitchLedgerModeRequest() {
  return (dispatch, getState) => {
    dispatch(updateLedgerStatus(LEDGER_STATES.SWITCH_MODE))
  }
}

export function onEnableContractSupportRequest() {
  return (dispatch, getState) => {
    dispatch(updateLedgerStatus(LEDGER_STATES.ENABLE_CONTRACT_SUPPORT))
    dispatch(updateModal({
      type: MODAL_LEDGER,
      error: 'Please enable Contract Data on your Ledger to use Augur.',
      canClose: true,
    }))
  }
}
