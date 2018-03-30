import React from 'react'


import { spy } from 'sinon'
import { shallow } from 'enzyme'
import ReportingDispute from 'src/modules/reporting/components/reporting-dispute-markets/reporting-dispute-markets'

describe('report dispute component', () => {
  describe('props', () => {
    let props

    beforeEach(() => {
      props = {
        doesUserHaveRep: false,
        location: {},
        markets: [],
        marketsCount: 0,
        navigateToAccountDepositHandler: spy(),
      }
    })

    describe('doesUserHaveRep', () => {
      let doesUserHaveRep
      describe('when true', () => {
        beforeEach(() => {
          doesUserHaveRep = true
        })

        it('should not render ReportDisputeNoRepState component', () => {
          const cmp = shallow(<ReportingDispute {...props} doesUserHaveRep={doesUserHaveRep} />)
          assert.lengthOf(cmp.find('ReportDisputeNoRepState'), 0)
        })
      })

      describe('when false', () => {
        beforeEach(() => {
          doesUserHaveRep = false
        })

        it('should render ReportDisputeNoRepState component', () => {
          const cmp = shallow(<ReportingDispute {...props} doesUserHaveRep={doesUserHaveRep} />)
          assert.lengthOf(cmp.find('ReportDisputeNoRepState'), 1)
        })
      })
    })
  })
})

