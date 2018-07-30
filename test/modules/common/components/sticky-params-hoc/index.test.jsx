import React from 'react'

import { it } from 'mocha'
import { assert } from 'chai'

import { shallow } from 'enzyme'

import { StickyParamsHOC } from 'src/modules/common/components/sticky-params-hoc'

describe('src/modules/common/components/url-param-maintaining-EmptyComponent/index.jsx', () => {
  const baseTo = {
    pathname: 'somepathname',
  }
  const children = (<div />)

  const EmptyComponent = () => null
  let StickyParamsCmp
  let exampleLocation
  const exampleKeysToMaintain = [
    'key1',
    'key2',
  ]

  beforeEach(() => {
    StickyParamsCmp = StickyParamsHOC(EmptyComponent, exampleKeysToMaintain)
  })

  describe('react-router EmptyComponent component', () => {
    it('should be returned', () => {
      const EmptyComponentCmp = shallow(<StickyParamsCmp location={{}} to={baseTo} />).find(EmptyComponent)
      assert.lengthOf(EmptyComponentCmp, 1)
    })

    it('should pass props directly through to wrapped component', () => {
      const exampleProp = 'exampleProp'
      const EmptyComponentCmp = shallow(<StickyParamsCmp location={{}} to={baseTo} someProp={exampleProp} />).find(EmptyComponent)
      assert.propertyVal(EmptyComponentCmp.props(), 'someProp', exampleProp)
    })

    it('should not pass staticContext prop thru', () => {
      const exampleProp = 'exampleProp'
      const EmptyComponentCmp = shallow(<StickyParamsCmp location={{}} to={baseTo} staticContext={exampleProp} />).find(EmptyComponent)
      assert.notProperty(EmptyComponentCmp.props(), 'staticContext')
    })
  })

  it('should recieve the children of the parent', () => {
    const EmptyComponentCmp = shallow(<StickyParamsCmp location={{}} to={baseTo}>{children}</StickyParamsCmp>).find(EmptyComponent)
    assert.propertyVal(EmptyComponentCmp.props(), 'children', children)
  })

  describe('"to" is a string', () => {
    describe('with url params', () => {
      it('should parse the to string into a "to" object', () => {
        const EmptyComponentCmp = shallow(<StickyParamsCmp to="/somewhere?key0=value0" location={{}} />).find(EmptyComponent)
        assert.deepPropertyVal(EmptyComponentCmp.props(), 'to', {
          pathname: '/somewhere',
          search: '?key0=value0',
        })
      })
    })

    describe('without url params', () => {
      it('should parse the to string into a "to" object', () => {
        const EmptyComponentCmp = shallow(<StickyParamsCmp to="/somewhere" location={{}} />).find(EmptyComponent)
        assert.deepPropertyVal(EmptyComponentCmp.props(), 'to', {
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

          const EmptyComponentCmp = shallow(<StickyParamsCmp to={to} location={exampleLocation} />).find(EmptyComponent)
          assert.deepPropertyVal(EmptyComponentCmp.props(), 'to', {
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

          const EmptyComponentCmp = shallow(<StickyParamsCmp to={to} location={exampleLocation} />).find(EmptyComponent)
          assert.deepPropertyVal(EmptyComponentCmp.props(), 'to', {
            pathname: '/somewhere',
            search: '?key1=value1',
          })
        })
      })
    })
  })

})
