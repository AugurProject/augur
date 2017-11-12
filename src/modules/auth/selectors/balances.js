import { isZero } from 'utils/math'

export const anyAccountBalancesZero = balances => (
  (balances.eth !== undefined && isZero(balances.eth)) ||
  (balances.rep !== undefined && isZero(balances.rep))
)

export const allAccountBalancesZero = balances => (
  (balances.eth !== undefined && isZero(balances.eth)) &&
  (balances.rep !== undefined && isZero(balances.rep))
)

export const allAssetsLoaded = assets => (
    assets.eth !== undefined && assets.rep !== undefined
)
// assets.ethTokens !== undefined &&
// (balances.ethTokens !== undefined && isZero(balances.ethTokens)) &&
// (balances.ethTokens !== undefined && isZero(balances.ethTokens)) ||
