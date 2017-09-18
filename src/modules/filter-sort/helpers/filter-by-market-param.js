import getValue from 'utils/get-value'

export default function (selectedMarketParam = 'volume', selectedSort = true, items, combinedFiltered) {
  return combinedFiltered.slice().sort((a, b) => {
    switch (selectedMarketParam) {
      case 'creationTime':
      case 'endDate': {
        if (selectedSort) {
          return getValue(items, `${b}.${selectedMarketParam}.timestamp`) - getValue(items, `${a}.${selectedMarketParam}.timestamp`)
        }

        return getValue(items, `${a}.${selectedMarketParam}.timestamp`) - getValue(items, `${b}.${selectedMarketParam}.timestamp`)
      }
      case 'volume':
      case 'takerFeePercent':
      case 'makerFeePercent': {
        if (selectedSort) {
          return getValue(items, `${b}.${selectedMarketParam}.value`) - getValue(items, `${a}.${selectedMarketParam}.value`)
        }

        return getValue(items, `${a}.${selectedMarketParam}.value`) - getValue(items, `${b}.${selectedMarketParam}.value`)
      }
      default:
        return 0 // No sorting
    }
  })
}
