export function FindReact(dom) {
  const key = Object.keys(dom).find(key =>
    key.startsWith("__reactInternalInstance$")
  );
  const internalInstance = dom[key];
  if (internalInstance == null) return null;

  if (internalInstance.return) {
    // react 16+
    return internalInstance.return.stateNode;
  } // react <16
  return internalInstance._currentElement._owner._instance;
}
