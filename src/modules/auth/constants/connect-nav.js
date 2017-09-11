import { Ledger, Airbitz, uPort, Trezor, Key } from 'modules/common/components/icons/icons'

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
    icon: Key
  },
  {
    param: PARAMS.TREZOR,
    title: 'Trezor',
    icon: Trezor
  },
  {
    param: PARAMS.LEDGER,
    title: 'Ledger',
    icon: Ledger
  }
]
