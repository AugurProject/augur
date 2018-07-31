import React from 'react'

import { spy } from 'sinon'
import { shallow } from 'enzyme'

import CreateMarketOutcome
  from 'src/modules/create-market/components/create-market-form-outcome/create-market-form-outcome'
import { SCALAR } from 'src/modules/markets/constants/market-types'
import { createBigNumber } from 'src/utils/create-big-number'

describe('create-market-form-outcome', () => {
  let cmp
  let isValidSpy
  let newMarket
  let updateNewMarketSpy
  let validateFieldSpy

  beforeEach(() => {
    newMarket = {
      isValid: false,
      validations: [
        {
          description: false,
          category: false,
          tag1: true,
          tag2: true,
        },
        {
          type: false,
        },
        {
          designatedReporterType: false,
          designatedReporterAddress: false,
          expirySourceType: false,
          endTime: false,
          hour: false,
          minute: false,
          meridiem: false,
        },
        {
          settlementFee: true,
        },
      ],
      currentStep: 0,
      type: '',
      outcomes: Array(8).fill(''),
      scalarSmallNum: '',
      scalarBigNum: '',
      scalarDenomination: '',
      description: '',
      expirySourceType: '',
      expirySource: '',
      designatedReporterType: '',
      designatedReporterAddress: '',
      endTime: {},
      hour: '',
      minute: '',
      meridiem: '',
      detailsText: '',
      category: '',
      tag1: '',
      tag2: '',
      orderBook: {},
      orderBookSorted: {},
      orderBookSeries: {},
      initialLiquidityEth: createBigNumber(0),
      initialLiquidityGas: createBigNumber(0),
      creationError: 'Unable to create market.  Ensure your market is unique and all values are valid.',
    }

    isValidSpy = spy()
    updateNewMarketSpy = spy()
    validateFieldSpy = spy()
  })

  describe('scalar market', () => {
    let tickSizeInput

    beforeEach(() => {
      newMarket.type = SCALAR
      newMarket.currentStep = 1
      cmp = shallow(<CreateMarketOutcome
        newMarket={newMarket}
        updateNewMarket={updateNewMarketSpy}
        validateField={validateFieldSpy}
        isValid={isValidSpy}
        isMobileSmall={false}
      />)

      tickSizeInput = cmp.find('#cm__input--ticksize')
    })

    describe('tick size field', () => {
      describe('when less tha zero', () => {
        it('should render validation message', () => {
          tickSizeInput.simulate('change', { target: { value: '-7' } })
          const newMarketObj = updateNewMarketSpy.args[0][0]

          assert.equal(newMarketObj.tickSize, '-7')
          assert.equal(newMarketObj.validations[newMarketObj.currentStep].tickSize, 'Tick size cannot be negative.')
        })
      })

      describe('when zero', () => {
        let newMarketObj

        beforeEach(() => {
          tickSizeInput.simulate('change', { target: { value: 0 } })
          newMarketObj = updateNewMarketSpy.args[0][0]
        })

        it('should update market with new value', () => {
          assert.equal(newMarketObj.tickSize, 0)
        })

        it('should set validation message to true', () => {
          assert.equal(newMarketObj.validations[newMarketObj.currentStep].tickSize, 'Tick size is required.')
        })
      })

      describe('when valid', () => {
        let newMarketObj

        beforeEach(() => {
          tickSizeInput.simulate('change', { target: { value: 1000 } })
          newMarketObj = updateNewMarketSpy.args[0][0]
        })

        it('should update market with new value', () => {
          assert.equal(newMarketObj.tickSize, 1000)
        })

        it('should set validation message to true', () => {
          assert.isTrue(newMarketObj.validations[newMarketObj.currentStep].tickSize)
        })
      })

      describe('validation message', () => {
        it('should render into the dom tree when provided', () => {
          const validationMessage = 'Some fancy validation message'
          newMarket.validations[newMarket.currentStep].tickSize = validationMessage

          cmp.setProps({
            newMarket,
          })

          assert.include(cmp.text(), validationMessage)
        })
      })
    })
  })
})
