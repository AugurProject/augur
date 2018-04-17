import React from 'react'

import { describe, it } from 'mocha'
import { assert } from 'chai'

import { shallow } from 'enzyme'

import TimeRemainingIndicatorWrapper from 'src/modules/market/components/common/time-remaining-indicator/time-remaining-indicator'

describe('time-remaining-indicator', () => {
  const EmptyComponent = () => null

  // These are exactly one minute apart.
  const startTimeInUTC = 1519261200000
  const endTimeInUTC = 1519261260000
  const thirtySecondsInMiliseconds = 30000

  let Cmp
  let endTimeAsDate
  let startTimeAsDate

  beforeEach(() => {
    Cmp = TimeRemainingIndicatorWrapper(EmptyComponent)

    startTimeAsDate = new Date(startTimeInUTC)
    endTimeAsDate = new Date(endTimeInUTC)
  })

  describe('current time is in interval', () => {
    it('should calculate percentage elapsed using "currentTimestamp"', () => {
      const wrapper = shallow(<Cmp startDate={startTimeAsDate} endTime={endTimeAsDate} currentTimestamp={startTimeInUTC + thirtySecondsInMiliseconds} />)
      const emptyCmpArr = wrapper.find(EmptyComponent)

      assert.lengthOf(emptyCmpArr, 1)
      assert.propertyVal(emptyCmpArr.props(), 'percentage', 0.5)
    })
  })

  describe('current time is before interval', () => {
    it('should clamp percentages 0', () => {
      const wrapper = shallow(<Cmp startDate={startTimeAsDate} endTime={endTimeAsDate} currentTimestamp={startTimeInUTC - thirtySecondsInMiliseconds} />)
      const emptyCmpArr = wrapper.find(EmptyComponent)

      assert.lengthOf(emptyCmpArr, 1)
      assert.propertyVal(emptyCmpArr.props(), 'percentage', 0)
    })
  })

  describe('current time is after interval', () => {
    it('should clamp percentage to 100', () => {
      const wrapper = shallow(<Cmp startDate={startTimeAsDate} endTime={endTimeAsDate} currentTimestamp={startTimeInUTC + (thirtySecondsInMiliseconds * 4)} />)
      const emptyCmpArr = wrapper.find(EmptyComponent)

      assert.lengthOf(emptyCmpArr, 1)
      assert.propertyVal(emptyCmpArr.props(), 'percentage', 1)
    })
  })

  describe('wrapped component props', () => {
    let emptyCmpArr
    beforeEach(() => {
      const wrapper = shallow(<Cmp startDate={startTimeAsDate} endTime={endTimeAsDate} someprop="hello!" />)
      emptyCmpArr = wrapper.find(EmptyComponent)
    })

    it('should contain any arbitrary props to the wrapper', () => {
      assert.propertyVal(emptyCmpArr.props(), 'someprop', 'hello!')
    })

    it('should not contain endTime', () => {
      assert.notProperty(emptyCmpArr.props(), 'endTime')
    })

    it('should not contain startDate', () => {
      assert.notProperty(emptyCmpArr.props(), 'startDate')
    })

    it('should not contain startDate', () => {
      assert.notProperty(emptyCmpArr.props(), 'currentTimestamp')
    })
  })

  describe('when endTime is before startDate', () => {
    it('should not render the wrapped component', () => {
      const cmp = shallow(<Cmp startDate={endTimeAsDate} endTime={startTimeAsDate} />)
      assert.lengthOf(cmp.find(EmptyComponent), 0)
    })
  })
})
