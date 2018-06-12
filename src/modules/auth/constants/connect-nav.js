import { Ledger, Edge, uPort, MetaMask, Trezor } from 'modules/common/components/icons'

export const PARAMS = {
  EDGE: 'edge',
  UPORT: 'uport',
  LEDGER: 'ledger',
  METAMASK: 'metamask',
  TREZOR: 'trezor',
}

export const ITEMS = [
  {
    param: PARAMS.EDGE,
    title: 'Edge',
    icon: Edge,
    default: true,
  },
  {
    param: PARAMS.METAMASK,
    title: 'MetaMask',
    icon: MetaMask,
  },
  {
    param: PARAMS.UPORT,
    title: 'uPort',
    icon: uPort,
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
