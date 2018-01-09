import { updateModal } from 'modules/modal/actions/update-modal'
import { closeModal } from 'modules/modal/actions/close-modal'

import { MODAL_LEDGER } from 'modules/modal/constants/modal-types'

const ledgerSigner = async (passedArguments, ledgerLib, dispatch) => {
  dispatch(updateModal({
    type: MODAL_LEDGER
  }))

  ledgerLib.signTransactionByBip44Index(...passedArguments)
    .then((res) => {
      dispatch(closeModal())
    })
    .catch((err) => {
      dispatch(updateModal({
        type: MODAL_LEDGER,
        error: `Failed to Sign with "${err}"`,
        canClose: true
      }))
    })
}

export default ledgerSigner
