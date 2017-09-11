import { MarketStatusOpen, Ledger, Airbitz, uPort } from 'modules/common/components/icons/icons'

export const PARAMS = {
  AIRBITZ: 'airbitz',
  UPORT: 'uport',
  KEYSTORE: 'keystore',
  TREZOR: 'trezor',
  LEDGER: 'ledger'
}

export const ITEMS = [
  {
    param: PARAMS.AIRBITZ,
    title: 'Airbitz',
    icon: Airbitz,
    default: true
  },
  {
    param: PARAMS.UPORT,
    title: 'uPort',
    icon: uPort
  },
  {
    param: PARAMS.KEYSTORE,
    title: 'Keystore',
    icon: MarketStatusOpen
  },
  {
    param: PARAMS.TREZOR,
    title: 'Trezor',
    icon: MarketStatusOpen
  },
  {
    param: PARAMS.LEDGER,
    title: 'Ledger',
    icon: Ledger
  }
]
