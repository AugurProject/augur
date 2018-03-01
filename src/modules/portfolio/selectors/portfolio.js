import getPortfolioTotals from 'modules/portfolio/selectors/portfolio-totals'

export default function () {
  return {
    totals: getPortfolioTotals(),
  }
}
