import EdgeConnect from 'modules/auth/containers/edge-connect'
import LedgerConnect from 'modules/auth/containers/ledger-connect'
import MetaMaskConnect from 'modules/auth/containers/metamask-connect'
import TrezorConnect from 'modules/auth/containers/trezor'

import { Ledger, Edge, MetaMask, Trezor } from 'modules/common/components/icons'

export const PARAMS = {
  EDGE: 'edge',
  LEDGER: 'ledger',
  METAMASK: 'metamask',
  TREZOR: 'trezor',
}

export const ITEMS = [
  {
    param: PARAMS.METAMASK,
    title: 'MetaMask',
    icon: MetaMask,
    default: true,
  },
  {
    param: PARAMS.LEDGER,
    title: 'Ledger',
    icon: Ledger,
  },
  {
    param: PARAMS.TREZOR,
    title: 'Trezor',
    icon: Trezor,
  },
]

if (!process.env.AUGUR_HOSTED) {
  ITEMS.unshift({
    param: PARAMS.EDGE,
    title: 'Edge',
    icon: Edge,
  })
}

const VIEWS = {
  [PARAMS.LEDGER]: LedgerConnect,
  [PARAMS.METAMASK]: MetaMaskConnect,
  [PARAMS.TREZOR]: TrezorConnect,
}

if (!process.env.AUGUR_HOSTED) {
  VIEWS[PARAMS.EDGE] = EdgeConnect
}
export const getView = selectedNav => VIEWS[selectedNav] || VIEWS[PARAMS.METAMASK]
