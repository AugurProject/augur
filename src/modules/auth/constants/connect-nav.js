import { MarketStatusOpen } from 'modules/common/components/icons/icons'

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
    Icon: MarketStatusOpen,
    default: true
  },
  {
    param: PARAMS.UPORT,
    title: 'uPort',
    icon: MarketStatusOpen
  },
  {
    param: PARAMS.KEYSTORE,
    title: 'Keystore',
    Icon: MarketStatusOpen
  },
  {
    param: PARAMS.TREZOR,
    title: 'Trezor',
    Icon: MarketStatusOpen
  },
  {
    param: PARAMS.LEDGER,
    title: 'Ledger',
    Icon: MarketStatusOpen
  }
]
