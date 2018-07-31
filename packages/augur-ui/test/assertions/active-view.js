

export default function (activeView) {
  assert.isDefined(activeView, `activeView isn't defined`)
  assert.isString(activeView, `activeView isn't a string`)
}
