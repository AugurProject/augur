import BigNumber from 'bignumber.js'

const CustomPropTypes = {
  bigNumber: function bigNumber(props, propName, componentName) {
    if (!BigNumber.isBigNumber(props[propName])) {
      return new Error('Invalid prop `' + propName + '` supplied to `' + componentName + '`. Validation failed, not an instance of BigNumber')
    }
  },
}

export default CustomPropTypes

