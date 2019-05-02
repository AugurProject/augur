export function checkPropsChange(obj1, obj2, attributesToCompare) {
  for (let i = 0; i < attributesToCompare.length; i++) {
    const attrName = attributesToCompare[i];
    if (obj1[attrName] !== obj2[attrName]) return true;
  }

  return false;
}
