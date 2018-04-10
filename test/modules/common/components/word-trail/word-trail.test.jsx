import React from 'react'

import { it } from 'mocha'

import { shallow } from 'enzyme'
import WordTrail from 'modules/common/components/word-trail/word-trail'
import { SimpleButton } from 'modules/common/components/simple-button'

describe('word-trail', () => {
  let items
  let wrapper

  const SOME_LABEL = 'some-title'

  describe('when tags array is empty', () => {
    beforeEach(() => {
      items = []
      wrapper = shallow(<WordTrail items={items} label={SOME_LABEL} />)
    })

    it('should render a list', () => {
      assert.include(wrapper.html(), SOME_LABEL)
    })

    it('should only display the label prop', () => {
      const topLabel = wrapper.find('button')
      assert.lengthOf(topLabel, 0)
    })
  })

  describe('when tags are populated', () => {
    beforeEach(() => {
      items = [{
        label: 'tag1',
        onClick: () => {},
      }, {
        label: 'tag2',
        onClick: () => {},
      }]

      wrapper = shallow(<WordTrail items={items} label={SOME_LABEL} />)
    })

    it('should render each of them', () => {
      assert.lengthOf(wrapper.find(SimpleButton), 2)
    })

    it('should display the passed label for each item', () => {
      const titlesArr = wrapper.find(SimpleButton).map(cmp => cmp.props().text)
      assert.deepEqual(titlesArr, ['tag1', 'tag2'])
    })

    it('should display the top label prop', () => {
      assert.include(wrapper.html(), SOME_LABEL)
    })
  })
})
