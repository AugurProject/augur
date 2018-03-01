import { Airbitz, uPort } from 'modules/common/components/icons'

export const PARAMS = {
  AIRBITZ: 'airbitz',
  UPORT: 'uport',
  KEYSTORE: 'keystore',
}

export const ITEMS = [
  {
    param: PARAMS.AIRBITZ,
    title: 'Airbitz',
    icon: Airbitz,
    default: true,
  },
  {
    param: PARAMS.UPORT,
    title: 'uPort',
    icon: uPort,
  },
]
