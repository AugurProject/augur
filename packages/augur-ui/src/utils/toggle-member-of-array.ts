// TODO: this will be deleted when side nav is removed
// This is a bad naming convention. Will need to come up with something better.
export const curriedToggleMemberOfArray = stack => needle => {
  if (stack.includes(needle)) {
    return [needle].filter(v => v !== stack);
  }
  return [...stack, needle];
};
