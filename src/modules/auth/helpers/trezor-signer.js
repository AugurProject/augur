import { updateModal } from 'modules/modal/actions/update-modal'
import { closeModal } from 'modules/modal/actions/close-modal'
import TX from 'ethereumjs-tx'
import { prefixHex } from 'speedomatic'
import { augur } from 'services/augurjs'

import { MODAL_TREZOR } from 'modules/modal/constants/modal-types'

const trezorSigner = async (connect, addressPath, dispatch, rawTxArgs) => {
  function hex(num) {
    let str = prefixHex(num).slice(2)
    if (str.length % 2 !== 0) str = '0' + str
    return str
  }

  dispatch(updateModal({
    type: MODAL_TREZOR,
    info: 'Please sign transaction on Trezor',
  }))

  const tx = rawTxArgs[0]
  const callback = rawTxArgs[1]

  return new Promise((resolve, reject) => {
    tx.gasLimit || (tx.gasLimit = tx.gas)

    const chain = augur.rpc.getNetworkID()

    connect.ethereumSignTx(
      addressPath,
      hex(tx.nonce),
      hex(tx.gasPrice),
      hex(tx.gas),
      tx.to.slice(2),
      hex(tx.value),
      hex(tx.data),
      parseInt(chain, 10),
      (response) => {
        if (response.success) {
          tx.v = parseInt('' + response.v, 10)
          tx.r = '0x' + response.r
          tx.s = '0x' + response.s

          const signedTx = new TX(tx)

          const serialized = '0x' + signedTx.serialize().toString('hex')

          resolve(serialized)
        } else {
          reject(response.error)
        }
      },
    )
  }).then((res) => {
    callback(null, res)

    dispatch(closeModal())
  }).catch((err) => {
    callback(err)

    dispatch(updateModal({
      type: MODAL_TREZOR,
      info: `Error signing transaction: "${err}"`,
      canClose: true,
    }))
  })
}

export default trezorSigner
