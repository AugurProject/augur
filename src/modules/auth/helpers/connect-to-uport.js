import memoize from 'memoizee'
import { Connect } from 'uport-connect'
import { augur } from 'services/augurjs'

const NETWORKS = {
  1: 'mainnet',
  3: 'ropsten',
  4: 'rinkeby',
  42: 'kovan',
}

export const connectToUport = memoize(() => new Connect('AUGUR -- DEV', {
  clientId: '2ofGiHuZhhpDMAQeDxjoDhEsUQd1MayECgd',
  network: NETWORKS[augur.rpc.getNetworkID()],
}), { max: 1 })
