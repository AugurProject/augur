import { updateModal } from 'modules/modal/actions/update-modal'
import { closeModal } from 'modules/modal/actions/close-modal'
import EthTX from 'ethereumjs-tx'
import { prefixHex } from 'speedomatic'

import { MODAL_LEDGER } from 'modules/modal/constants/modal-types'

const ledgerSigner = async (rawTxArgs, ledgerLib, dispatch) => {
  dispatch(updateModal({
    type: MODAL_LEDGER
  }))

  const tx = rawTxArgs[0]
  tx.v = tx.chainId // NOTE: solves issue w/ lib setting the wrong chainID during signing, might not need in the future

  const callback = rawTxArgs[1]

  const formattedTx = new EthTX(rawTxArgs[0])

  return ledgerLib.signTransactionByBip44Index(formattedTx.serialize().toString('hex'))
    .then((res) => {
      tx.r = prefixHex(res.r)
      tx.s = prefixHex(res.s)
      tx.v = prefixHex(res.v)

      const signedTx = new EthTX(tx)

      callback(null, prefixHex(signedTx.serialize().toString('hex')))

      dispatch(closeModal())
    })
    .catch((err) => {
      callback(err)

      dispatch(updateModal({
        type: MODAL_LEDGER,
        error: `Failed to Sign with "${err}"`,
        canClose: true
      }))
    })
}

export default ledgerSigner
