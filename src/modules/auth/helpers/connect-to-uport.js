import { Connect } from 'uport-connect'
import { augur } from 'services/augurjs'

const NETWORKS = {
  1: 'mainnet',
  3: 'ropsten',
  4: 'rinkeby',
  42: 'kovan',
}

export const connectToUport = () => new Connect('AUGUR -- DEV', {
  clientId: '2ofGiHuZhhpDMAQeDxjoDhEsUQd1MayECgd',
  accountType: 'keypair',
  network: NETWORKS[augur.rpc.getNetworkID()],
})
