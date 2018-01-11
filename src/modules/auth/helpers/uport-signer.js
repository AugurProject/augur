import { Connect } from 'uport-connect'

import { updateModal } from 'modules/modal/actions/update-modal'

import { MODAL_UPORT } from 'modules/modal/constants/modal-types'

export default function uPortSigner(txObj, dispatch) {
  console.log('uPortSigner -- ', txObj)

  new Connect(
    'AUGUR -- DEV',
    {
      clientId: '2ofGiHuZhhpDMAQeDxjoDhEsUQd1MayECgd'
    }
  ).sendTransaction(txObj, (uri) => {
    dispatch(updateModal({
      type: MODAL_UPORT,
      uri
    }))
  }).then((res) => {
    console.log('res -- ', res)
  }).catch((err) => {
    console.log('err -- ', err)
  })
}
