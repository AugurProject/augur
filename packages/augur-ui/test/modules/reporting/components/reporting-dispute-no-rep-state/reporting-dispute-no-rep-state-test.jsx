import React from 'react'


import { spy } from 'sinon'
import { shallow } from 'enzyme'

import ReportDisputeNoRepState from 'src/modules/reporting/components/reporting-dispute-no-rep-state/reporting-dispute-no-rep-state'

describe('ReportDisputeNoRepState', () => {
  let cmp
  let exampleMessage
  let onClickSpy

  beforeEach(() => {
    onClickSpy = spy()
    exampleMessage = 'some message'
    cmp = shallow(<ReportDisputeNoRepState onClickHandler={onClickSpy} message={exampleMessage} />)
  })

  describe('props', () => {
    let btn

    beforeEach(() => {
      btn = cmp.find('button')
    })

    describe('message', () => {
      it('should be rendered into the DOM', () => {
        assert.include(cmp.text(), exampleMessage)
      })
    })

    describe('onClick', () => {
      it('should fire when action button is clicked', () => {
        btn.simulate('click')
        assert.ok(onClickSpy.called)
      })
    })

    describe('btnText', () => {
      it('should default to "OK"', () => {
        assert.include(btn.text(), 'OK')
      })

      it('should appear in the body of the button', () => {
        const btnText = 'some button text'
        cmp = shallow(<ReportDisputeNoRepState onClickHandler={onClickSpy} message={exampleMessage} btnText={btnText} />)

        assert.include(cmp.find('button').text(), btnText)
      })
    })
  })
})
