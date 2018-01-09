import { updateModal } from 'modules/modal/actions/update-modal'

import { MODAL_LEDGER } from 'modules/modal/constants/modal-types'

const ledgerSigner = async (passedArguments, ledgerLib) => {
  console.log('ledgerSigner -- ', passedArguments, ledgerLib)

  // updateModal({
  //   type: MODAL_LEDGER,
  //   action: 'sign transaction'
  // })


  const test = await ledgerLib.signTransactionByBip44Index(...passedArguments)

  console.log('test -- ', test)
}

export default ledgerSigner
