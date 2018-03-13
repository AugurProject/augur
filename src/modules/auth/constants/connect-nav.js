import { Ledger, uPort, MetaMask } from 'modules/common/components/icons'

export const PARAMS = {
  // AIRBITZ: 'airbitz',
  UPORT: 'uport',
  LEDGER: 'ledger',
  METAMASK: 'metamask',
}

export const ITEMS = [
  // {
  //   param: PARAMS.AIRBITZ,
  //   title: 'Airbitz',
  //   icon: Airbitz,
  //   default: true,
  // },
  {
    param: PARAMS.METAMASK,
    title: 'MetaMask',
    icon: MetaMask,
    default: true,
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
]
