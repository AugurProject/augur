import React from 'react'


import { shallow } from 'enzyme'
import { NoMarketsFound, ReportSection } from 'src/modules/reporting/components/reporting-report-markets/reporting-report-markets'
import ConnectedMarketPreview from 'src/modules/reporting/containers/market-preview'

describe('reporting-report-markets', () => {
  describe('props', () => {
    let cmp
    let exampleTitle

    beforeEach(() => {
      exampleTitle = 'some title'
      cmp = shallow(<ReportSection title={exampleTitle} items={[]} />)
    })

    it('should display the passed in title', () => {
      assert.include(cmp.text(), exampleTitle)
    })

    describe('when items array is empty', () => {
      it('should render no markets found component', () => {
        assert.lengthOf(cmp.find(NoMarketsFound), 1)
      })
    })

    describe('when items array is not empty', () => {
      it('should render markets component', () => {
        const items = [{
          id: 1,
          endTime: { timestamp: 1 },
        }, {
          id: 2,
          endTime: { timestamp: 1 },
        }, {
          id: 3,
          endTime: { timestamp: 1 },
        }]

        cmp = shallow(<ReportSection title={exampleTitle} items={items} />)
        assert.lengthOf(cmp.find(ConnectedMarketPreview), 3)
      })
    })

    describe('when items array is already sorted', () => {
      it('should render markets in given order (timestamp)', () => {
        const items = [{
          id: 1,
          endTime: { timestamp: 5 },
        }, {
          id: 2,
          endTime: { timestamp: 1 },
        }, {
          id: 3,
          endTime: { timestamp: 4 },
        }]

        cmp = shallow(<ReportSection title={exampleTitle} items={items} />)
        const sections = cmp.find(ConnectedMarketPreview)
        const result = sections.map(x => x.props().id)
        assert.deepEqual([1, 2, 3], result)
      })
    })

  })

  describe('NoMarketFound', () => {
    it('should display the message passed in', () => {
      const message = 'some message'
      const cmp = shallow(<NoMarketsFound message={message} />)

      assert.include(cmp.text(), message)
    })
  })

})
