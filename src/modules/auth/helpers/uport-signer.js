import { updateModal } from 'modules/modal/actions/update-modal'
import { closeModal } from 'modules/modal/actions/close-modal'
import { MODAL_UPORT } from 'modules/modal/constants/modal-types'

export const uPortSigner = (uPort, transaction) => (dispatch, getState) => {
  const uPortSigner = uPort.sendTransaction(transaction, uri => dispatch(updateModal({ type: MODAL_UPORT, uri })))
  uPortSigner
    .then(() => dispatch(closeModal()))
    .catch(err => dispatch(updateModal({ type: MODAL_UPORT, error: `Failed to Sign with "${err}"`, canClose: true })))
  return uPortSigner
}
