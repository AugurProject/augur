import getPortfolioTotals from "modules/positions/selectors/portfolio-totals";

export default function() {
  return {
    totals: getPortfolioTotals()
  };
}
