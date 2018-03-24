import { describe, it, before } from 'mocha'


import sinon from 'sinon'
import proxyquire from 'proxyquire'

import { MY_POSITIONS, MY_MARKETS, PORTFOLIO_REPORTS } from 'modules/routes/constants/views'

import { formatNumber, formatEther, formatRep } from 'utils/format-number'

describe('modules/portfolio/selectors/nav-items', () => {
  proxyquire.noPreserveCache().noCallThru()

  let actual

  const stubbedSelectors = {
    links: {
      myPositionsLink: {
        label: 'test',
        link: {
          href: 'test',
          onClick: 'fake function',
        },
        page: 'test',
      },
      myMarketsLink: {
        label: 'test',
        link: {
          href: 'test',
          onClick: 'fake function',
        },
        page: 'test',
      },
      myReportsLink: {
        label: 'test',
        link: {
          href: 'test',
          onClick: 'fake function',
        },
        page: 'test',
      },
    },
  }

  const selectors = {
    generateMarketsPositionsSummary: () => {},
    selectMyMarketsSummary: () => {},
    selectMyReportsSummary: () => {},
    selectAllMarkets: () => {},
    selectLinks: () => {},
  }

  const stubbedGenerateMarketsPositionsSummary = sinon.stub(selectors, 'generateMarketsPositionsSummary').callsFake(() => (
    {
      numPositions: formatNumber(10, { denomination: 'positions' }),
      totalNet: formatEther(2),
    }
  ))
  const stubbedMyMarketsSummary = sinon.stub(selectors, 'selectMyMarketsSummary').callsFake(() => (
    {
      numMarkets: 30,
      totalValue: 10,
    }
  ))

  const stubbedMyReportsSummary = sinon.stub(selectors, 'selectMyReportsSummary').callsFake(() => (
    {
      numReports: 10,
      netRep: 5,
    }
  ))

  const stubbedMarketsAll = sinon.stub(selectors, 'selectAllMarkets').returns([])

  const proxiedSelector = proxyquire('../../../src/modules/portfolio/selectors/portfolio-nav-items', {
    '../../my-positions/selectors/my-positions-summary': { generateMarketsPositionsSummary: stubbedGenerateMarketsPositionsSummary },
    '../../my-markets/selectors/my-markets-summary': stubbedMyMarketsSummary,
    '../../my-reports/selectors/my-reports-summary': stubbedMyReportsSummary,
    '../../markets/selectors/markets-all': stubbedMarketsAll,
    '../../../selectors': stubbedSelectors,
  })

  const expected = [
    {
      label: 'Positions',
      view: MY_POSITIONS,
      leadingTitle: 'Total Number of Positions',
      leadingValue: formatNumber(10, { denomination: 'positions' }),
      leadingValueNull: 'No Positions',
      trailingTitle: 'Total Profit/Loss',
      trailingValue: formatEther(2),
      trailingValueNull: 'No Profit/Loss',
    },
    {
      label: 'Markets',
      view: MY_MARKETS,
      leadingTitle: 'Total Markets',
      leadingValue: formatNumber(30, { denomination: 'Markets' }),
      leadingValueNull: 'No Markets',
      trailingTitle: 'Total Gain/Loss',
      trailingValue: formatEther(10),
      trailingValueNull: 'No Gain/Loss',
    },
    {
      label: 'Reports',
      view: PORTFOLIO_REPORTS,
      leadingTitle: 'Total Reports',
      leadingValue: formatNumber(10, { denomination: 'Reports' }),
      leadingValueNull: 'No Reports',
      trailingTitle: 'Total Gain/Loss',
      trailingValue: formatRep(5, { denomination: ' REP' }),
      trailingValueNull: 'No Gain/Loss',
    },
  ]

  before(() => {
    actual = proxiedSelector.default()
  })

  it(`should call 'selectMyPositionsSummary' once`, () => {
    assert(stubbedGenerateMarketsPositionsSummary.calledOnce, `Didn't call 'generateMarketsPositionsSummary' once as expected`)
  })

  it(`should call 'selectMyMarketsSummary' once`, () => {
    assert(stubbedMyMarketsSummary.calledOnce, `Didn't call 'selectMyMarketsSummary' once as expected`)
  })

  it(`should call 'selectMyReportsSummary' once`, () => {
    assert(stubbedMyReportsSummary.calledOnce, `Didn't call 'selectMyReportsSummary' once as expected`)
  })

  it('should return the expected array', () => {
    assert.deepEqual(expected, actual, `Didn't return the expected array`)
  })
})
