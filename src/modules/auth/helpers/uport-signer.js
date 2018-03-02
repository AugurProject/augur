import { Connect } from 'uport-connect'

import { updateModal } from 'modules/modal/actions/update-modal'
import { closeModal } from 'modules/modal/actions/close-modal'

import { MODAL_UPORT } from 'modules/modal/constants/modal-types'

export default function uPortSigner(txObj, dispatch) {
  new Connect(
    'AUGUR -- DEV',
    {
      clientId: '2ofGiHuZhhpDMAQeDxjoDhEsUQd1MayECgd',
    },
  )
    .sendTransaction(txObj, (uri) => {
      dispatch(updateModal({
        type: MODAL_UPORT,
        uri,
      }))
    })
    .then(() => dispatch(closeModal()))
    .catch((err) => {
      dispatch(updateModal({
        type: MODAL_UPORT,
        error: `Failed to Sign with "${err}"`,
        canClose: true,
      }))
    })
}
