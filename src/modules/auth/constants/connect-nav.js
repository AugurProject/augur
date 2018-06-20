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
    param: PARAMS.EDGE,
    title: 'Edge',
    icon: Edge,
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
