'use strict'

import Please from 'pleasejs'

export default function createColor (seed) {
  return Please.make_color({
    seed,
    saturation: 0.5,
    value: 1.0,
    golden: false
  })
}
