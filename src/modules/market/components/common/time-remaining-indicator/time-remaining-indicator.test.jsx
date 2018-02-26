import React from 'react'

import { describe, it } from 'mocha'
import { assert } from 'chai'

import { useFakeTimers } from 'sinon'
import { shallow } from 'enzyme'

import TimeRemainingIndicatorWrapper from 'src/modules/market/components/common/time-remaining-indicator/time-remaining-indicator'

describe('time-remaining-indicator', () => {
  const EmptyComponent = () => null

  // These are exactly one minute apart.
  const startTimeInUTC = 'Thu, 22 Feb 2018 01:00:00 GMT'
  const endTimeInUTC = 'Thu, 22 Feb 2018 01:01:00 GMT'
  const thirtySecondsInMiliseconds = 30000

  let Cmp
  let clock
  let endTimeAsDate
  let startTimeAsDate


  beforeEach(() => {
    clock = useFakeTimers(Date.parse(startTimeInUTC) - thirtySecondsInMiliseconds)
    Cmp = TimeRemainingIndicatorWrapper(EmptyComponent)

    startTimeAsDate = new Date(startTimeInUTC)
    endTimeAsDate = new Date(endTimeInUTC)
  })

  afterEach(() => {
    clock.restore()
  })

  describe('current time is in interval', () => {
    beforeEach(() => {
      // Skip ahead to start time.
      clock.tick(thirtySecondsInMiliseconds)
    })

    it('should calculate percentage elapsed using "now"', () => {
      // skip ahead 30 seconds
      clock.tick(thirtySecondsInMiliseconds)

      const wrapper = shallow(<Cmp startDate={startTimeAsDate} endDate={endTimeAsDate} />)
      const emptyCmpArr = wrapper.find(EmptyComponent)

      assert.lengthOf(emptyCmpArr, 1)
      assert.propertyVal(emptyCmpArr.props(), 'percentage', 0.5)
    })
  })

  describe('current time is before interval', () => {
    it('should clamp percentages 0', () => {
      const wrapper = shallow(<Cmp startDate={startTimeAsDate} endDate={endTimeAsDate} />)
      const emptyCmpArr = wrapper.find(EmptyComponent)

      assert.lengthOf(emptyCmpArr, 1)
      assert.propertyVal(emptyCmpArr.props(), 'percentage', 0)
    })
  })

  describe('current time is after interval', () => {
    beforeEach(() => {
      clock.tick(thirtySecondsInMiliseconds * 4)
    })

    it('should clamp percentage to 100', () => {
      const wrapper = shallow(<Cmp startDate={startTimeAsDate} endDate={endTimeAsDate} />)
      const emptyCmpArr = wrapper.find(EmptyComponent)

      assert.lengthOf(emptyCmpArr, 1)
      assert.propertyVal(emptyCmpArr.props(), 'percentage', 1)
    })
  })

  describe('wrapped component props', () => {
    let emptyCmpArr
    beforeEach(() => {
      const wrapper = shallow(<Cmp startDate={startTimeAsDate} endDate={endTimeAsDate} someprop="hello!" />)
      emptyCmpArr = wrapper.find(EmptyComponent)
    })

    it('should contain any arbitrary props to the wrapper', () => {
      assert.propertyVal(emptyCmpArr.props(), 'someprop', 'hello!')
    })

    it('should not contain endDate', () => {
      assert.notProperty(emptyCmpArr.props(), 'endDate')
    })

    it('should not contain startDate', () => {
      assert.notProperty(emptyCmpArr.props(), 'startDate')
    })
  })

  describe('when endDate is before startDate', () => {
    it('should not render the wrapped component', () => {
      const cmp = shallow(<Cmp startDate={endTimeAsDate} endDate={startTimeAsDate} />)
      assert.lengthOf(cmp.find(EmptyComponent), 0)
    })
  })
})

