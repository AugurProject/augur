import { MICRO_SHARE, MILLI_SHARE, SHARE } from 'modules/market/constants/share-denominations'

export default function (selectedDenomination, shareDenominations) {
  switch (selectedDenomination) {
    case (MICRO_SHARE): {
      const value = shareDenominations && shareDenominations.find(denomination => denomination.value === MICRO_SHARE)
      return (value && value.label) || 'μShares'
    }
    case (MILLI_SHARE): {
      const value = shareDenominations && shareDenominations.find(denomination => denomination.value === MILLI_SHARE)
      return (value && value.label) || 'mShares'
    }
    default:
    case (SHARE): {
      const value = shareDenominations && shareDenominations.find(denomination => denomination.value === SHARE)
      return (value && value.label) || 'Shares'
    }
  }
}
