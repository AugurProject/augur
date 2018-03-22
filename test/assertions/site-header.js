
import assertActivePage from './active-view'
import assertPositionsSummary from './positions-summary'
import assertTransactionsTotals from './transactions-totals'
import assertIsTransactionsWorking from './is-transactions-working'

export default function (siteHeader) {
  assert.isDefined(siteHeader, `siteHeader isn't defined`)
  assert.isObject(siteHeader, `siteHeader isn't a object`)
  assertActivePage(siteHeader.activePage)
  assertPositionsSummary(siteHeader.positionsSummary)
  assertTransactionsTotals(siteHeader.transactionsTotals)
  assertIsTransactionsWorking(siteHeader.isTransactionsWorking)
}
