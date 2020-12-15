import { Web3Provider } from '@ethersproject/providers'

export default function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider, 'any')
  library.pollingInterval = 12000
  return library
}
