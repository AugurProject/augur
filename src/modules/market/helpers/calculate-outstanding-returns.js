export const calculateOutstandingReturns = (marketId, positions) => {
  let totalReturns = 0
  // this is prob wrong
  for (let i in positions[marketId]) {
    for (let j in positions[marketId][i]) {
      totalReturns += parseInt(positions[marketId][i][j].unrealizedProfitLoss) // do fancy match
    }
  }
  return totalReturns;
}
