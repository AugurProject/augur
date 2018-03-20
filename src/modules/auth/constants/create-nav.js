import { Edge, uPort } from 'modules/common/components/icons'

export const PARAMS = {
  EDGE: 'edge',
  UPORT: 'uport',
  KEYSTORE: 'keystore',
}

export const ITEMS = [
  {
    param: PARAMS.EDGE,
    title: 'Edge',
    icon: Edge,
    default: true,
  },
  {
    param: PARAMS.UPORT,
    title: 'uPort',
    icon: uPort,
  },
]
