export function checkPropsChange(obj1: object, obj2: object, attributesToCompare: Array<string>): boolean {
  for (const attrib of attributesToCompare) {
    if (obj1[attrib] !== obj2[attrib]) return true;
  }

  return false;
}
