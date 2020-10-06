import { AMM_FACTORY_ADDRESS, AMMFactoryAbi /*AMMExchangeAbi*/ } from '../constants'
import { ethers } from 'ethers'

export const getAMMAddressForMarketShareToken = async (network, marketAddress, shareTokenAddress) => {
  const provider = ethers.getDefaultProvider(network)
  const ammFactoryContract = new ethers.Contract(AMM_FACTORY_ADDRESS, AMMFactoryAbi, provider)

  const ammAddress = await ammFactoryContract.getAMM(marketAddress, shareTokenAddress)
  return ammAddress
}

export const checkIfDeployed = (token0, token1) => {
  // TODO
  return false
}

export const userLPBalanceOf = async (network, ammAddress, userAddress) => {
  return false
  // todo: use this when amm exchange address comes in
  /*
  const provider = ethers.getDefaultProvider(network)
  const ammFactoryContract = new ethers.Contract(ammAddress, AMMExchangeAbi, provider)
  const balance = await ammFactoryContract.balanceOf(userAddress)
  return balance
  */
}
