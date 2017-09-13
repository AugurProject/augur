import { Airbitz, uPort, Key } from 'modules/common/components/icons/icons'

export const PARAMS = {
  AIRBITZ: 'airbitz',
  UPORT: 'uport',
  KEYSTORE: 'keystore'
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
  }
]
