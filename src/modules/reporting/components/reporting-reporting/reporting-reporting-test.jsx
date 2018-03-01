import React from 'react'

import { describe, it } from 'mocha'
import { assert } from 'chai'

import { shallow } from 'enzyme'
import { NoMarketsFound, ReportSection } from 'src/modules/reporting/components/reporting-reporting/reporting-reporting'
import ConnectedMarketPreview from 'src/modules/reporting/containers/market-preview'

describe('reporting-reporting', () => {
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
      it('should render no markets found component', () => {
        const items = [{
          id: 1,
        }, {
          id: 2,
        }, {
          id: 3,
        }]

        cmp = shallow(<ReportSection title={exampleTitle} items={items} />)
        assert.lengthOf(cmp.find(ConnectedMarketPreview), 3)
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
