export const calculateOutstandingReturns = (marketId, positions) => {
  let totalReturns = 0
  // this is prob wrong, sometimes positions is empty?
  if (positions && positions[marketId]) {
  	console.log('hi')
    for (let i = 0; i < positions[marketId].length; i++) {
      for (let j = 0; j < positions[marketId][i]; j++) {
        totalReturns += parseInt(positions[marketId][i][j].unrealizedProfitLoss, 10) // do fancy match
      }
    }
  }

  return totalReturns
}
