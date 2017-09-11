import { MarketStatusOpen } from 'modules/common/components/icons/icons'

export const PARAMS = {
  AIRBITZ: 'AIRBITZ',
  UPORT: 'UPORT',
  KEYSTORE: 'KEYSTORE',
  TREZOR: 'TREZOR',
  LEDGER: 'LEDGER'
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
