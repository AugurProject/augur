import { Connect } from 'uport-connect'

export let uport = new Connect('AUGUR -- DEV',
  {
    clientId: '2ofGiHuZhhpDMAQeDxjoDhEsUQd1MayECgd'
  }
)
export const uPortweb3 = uport.getWeb3()
