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
  assets.eth !== undefined && assets.rep !== undefined && assets.legacyRep !== undefined && assets.legacyRepAllowance !== undefined
)
