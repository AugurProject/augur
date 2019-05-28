import { curry, without } from "lodash/fp";
// TODO: this will be deleted when side nav is removed
const toggleMemberOfArray = (stack, needle) => {
  if (stack.includes(needle)) {
    return without([needle], stack);
  }
  return [...stack, needle];
};

// This is a bad naming convention. Will need to come up with something better.
export const curriedToggleMemberOfArray = curry(toggleMemberOfArray);
export default toggleMemberOfArray;
