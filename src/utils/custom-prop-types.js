import BigNumber from "bignumber.js";

// This is a factory function
function createCustomPropType(isRequired) {
  // The factory returns a custom prop type
  return function customPropType(props, propName, componentName) {
    const prop = props[propName];
    if (prop == null) {
      // Prop is missing
      if (isRequired) {
        // Prop is required but wasn't specified. Throw an error.
        throw new Error(
          "Required prop `" +
            propName +
            "` wasn't supplied to `" +
            componentName +
            "`."
        );
      }
      // Prop is optional. Do nothing.
    } else if (!BigNumber.isBigNumber(props[propName])) {
      return new Error(
        "Invalid prop `" +
          propName +
          "` supplied to `" +
          componentName +
          "`. Validation failed, not an instance of BigNumber"
      );
    }
  };
}

const CustomPropTypes = {
  bigNumber: createCustomPropType(false)
};
CustomPropTypes.bigNumber.isRequired = createCustomPropType(true);

export default CustomPropTypes;
