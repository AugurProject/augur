import React from 'react'

import { it } from 'mocha'
import { assert } from 'chai'

import { shallow } from 'enzyme'

import { StickyParamsLink } from 'src/modules/common/components/sticky-params-link'
import { Link } from 'react-router-dom'

describe('src/modules/common/components/url-param-maintaining-link/index.jsx', () => {
  const children = (<div />)
  const baseTo = {
    pathname: 'somepathname',
  }

  let exampleLocation

  const exampleKeysToMaintain = [
    'key1',
    'key2',
  ]

  describe('react-router Link component', () => {
    it('should be returned', () => {
      const linkCmp = shallow(<StickyParamsLink location={{}} to={baseTo} />).find(Link)
      assert.lengthOf(linkCmp, 1)
    })
  })

  it('should recieve the children of the parent', () => {
    const linkCmp = shallow(<StickyParamsLink location={{}} to={baseTo}>{children}</StickyParamsLink>).find(Link)
    assert.propertyVal(linkCmp.props(), 'children', children)
  })

  describe('"to" is a string', () => {
    describe('with url params', () => {
      it('should parse the to string into a "to" object', () => {
        const linkCmp = shallow(<StickyParamsLink to="/somewhere?key0=value0" location={{}} keysToMaintain={exampleKeysToMaintain} />).find(Link)
        assert.deepPropertyVal(linkCmp.props(), 'to', {
          pathname: '/somewhere',
          search: '?key0=value0',
        })
      })
    })

    describe('without url params', () => {
      it('should parse the to string into a "to" object', () => {
        const linkCmp = shallow(<StickyParamsLink to="/somewhere" location={{}} />).find(Link)
        assert.deepPropertyVal(linkCmp.props(), 'to', {
          pathname: '/somewhere',
        })
      })
    })
  })

  describe('"to" is an object', () => {
    describe('keysToMaintain', () => {
      beforeEach(() => {
        exampleLocation = {
          pathname: '/somewhere',
          search: '?key1=value1',
        }
      })

      describe('with passed search string', () => {
        it('should pluck values from location and appended to the resultant search params', () => {
          const to = {
            pathname: '/somewhere',
            search: '?newkey1=newvalue1&newkey2=newvalue2',
          }

          const linkCmp = shallow(<StickyParamsLink to={to} location={exampleLocation} keysToMaintain={exampleKeysToMaintain} />).find(Link)
          assert.deepPropertyVal(linkCmp.props(), 'to', {
            pathname: '/somewhere',
            search: '?key1=value1&newkey1=newvalue1&newkey2=newvalue2',
          })
        })
      })

      describe('without passed search string', () => {
        it('should pluck values from location and appended to the resultant search params', () => {
          const to = {
            pathname: '/somewhere',
          }

          const linkCmp = shallow(<StickyParamsLink to={to} location={exampleLocation} keysToMaintain={exampleKeysToMaintain} />).find(Link)
          assert.deepPropertyVal(linkCmp.props(), 'to', {
            pathname: '/somewhere',
            search: '?key1=value1',
          })
        })
      })
    })
  })

})
