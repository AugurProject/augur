export const calculateOutstandingReturns = (marketId, positions) => {
  let totalReturns = 0
  if (positions && positions[marketId]) {
    Object.keys(positions[marketId]).forEach((key) => {
      console.log(positions[marketId][key])
      if (positions[marketId][key]) {
        for (let i = 0; i < positions[marketId][key].length; i++) {
          totalReturns += parseFloat(positions[marketId][key][i].unrealizedProfitLoss)
        }
      }
    })
  }
  return totalReturns
}
