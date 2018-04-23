import { Connect } from 'uport-connect'
import { augur } from 'services/augurjs'
import { updateModal } from 'modules/modal/actions/update-modal'
import { closeModal } from 'modules/modal/actions/close-modal'
import { MODAL_UPORT } from 'modules/modal/constants/modal-types'

const networks = {
  1: 'mainnet',
  3: 'ropsten',
  4: undefined, // rinkeby (default)
  42: 'kovan',
}

export const uPortSigner = transaction => dispatch => new Connect('AUGUR -- DEV', {
  clientId: '2ofGiHuZhhpDMAQeDxjoDhEsUQd1MayECgd',
  accountType: 'keypair',
  network: networks[augur.rpc.getNetworkID()],
}).sendTransaction(transaction, uri => (
  dispatch(updateModal({ type: MODAL_UPORT, uri })))
).then(() => (
  dispatch(closeModal()))
).catch(err => (
  dispatch(updateModal({ type: MODAL_UPORT, error: `Failed to Sign with "${err}"`, canClose: true })))
)
