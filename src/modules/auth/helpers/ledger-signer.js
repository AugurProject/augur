import { updateModal } from 'modules/modal/actions/update-modal'
import { closeModal } from 'modules/modal/actions/close-modal'
import EthereumTX from 'ethereumjs-tx'
import { prefixHex } from 'speedomatic'

import { MODAL_LEDGER } from 'modules/modal/constants/modal-types'

const ledgerSigner = async (passedArguments, ledgerLib, dispatch) => {
  dispatch(updateModal({
    type: MODAL_LEDGER
  }))

  const tx = new EthereumTX(passedArguments[0])

  return ledgerLib.signTransactionByBip44Index(tx.serialize().toString('hex'), 7)
    .then((res) => {
      tx.r = Buffer.from(res.r, 'hex')
      tx.s = Buffer.from(res.s, 'hex')
      tx.v = Buffer.from(res.v, 'hex')

      passedArguments[1](null, prefixHex(tx.serialize().toString('hex')))
      dispatch(closeModal())
    })
    .catch((err) => {
      passedArguments[1](err)

      dispatch(updateModal({
        type: MODAL_LEDGER,
        error: `Failed to Sign with "${err}"`,
        canClose: true
      }))
    })
}

export default ledgerSigner
