import { assert } from 'chai'

export default function (tags) {
  assert.isDefined(tags, `tags isn't defined`)
  assert.isObject(tags, `tags isn't an object`)
  assert.isDefined(tags.value, `tags.value isn't defined`)
  assert.isString(tags.value, `tags.value isn't a string`)
  assert.isDefined(tags.onChangeTags, `tags.onChangeTags isn't defined`)
  assert.isFunction(tags.onChangeTags, `tags.onChangeTags isn't a function`)
}
