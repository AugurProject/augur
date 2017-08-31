import { describe, it } from 'mocha'
import { assert } from 'chai'
import { selectTopics } from 'modules/topics/selectors/topics'

describe(`modules/topics/selectors/select-order-book.js`, () => {
  const test = t => it(t.description, () => (
    t.assertions(selectTopics({ topics: t.topics }))
  ))
  test({
    description: 'no topics',
    topics: {},
    assertions: (output) => {
      assert.deepEqual(output, [])
    }
  })
  test({
    description: '1 topic',
    topics: {
      testing: 10
    },
    assertions: (output) => {
      assert.deepEqual(output, [
        { topic: 'testing', popularity: 10 }
      ])
    }
  })
  test({
    description: '2 topics of unequal popularity',
    topics: {
      testing: 10,
      backflips: 2
    },
    assertions: (output) => {
      assert.deepEqual(output, [
        { topic: 'testing', popularity: 10 },
        { topic: 'backflips', popularity: 2 }
      ])
    }
  })
  test({
    description: '2 topics of equal popularity',
    topics: {
      testing: 10,
      frontflips: 10
    },
    assertions: (output) => {
      assert.deepEqual(output, [
        { topic: 'testing', popularity: 10 },
        { topic: 'frontflips', popularity: 10 }
      ])
    }
  })
  test({
    description: '3 topics of unequal popularity',
    topics: {
      testing: 10,
      backflips: 2,
      sideflips: 5
    },
    assertions: (output) => {
      assert.deepEqual(output, [
        { topic: 'testing', popularity: 10 },
        { topic: 'sideflips', popularity: 5 },
        { topic: 'backflips', popularity: 2 }
      ])
    }
  })
  test({
    description: '3 topics, 2 of equal popularity',
    topics: {
      testing: 10,
      backflips: 2,
      frontflips: 10
    },
    assertions: (output) => {
      assert.deepEqual(output, [
        { topic: 'testing', popularity: 10 },
        { topic: 'frontflips', popularity: 10 },
        { topic: 'backflips', popularity: 2 }
      ])
    }
  })
  test({
    description: '3 topics of equal popularity',
    topics: {
      testing: 10,
      twirling: 10,
      frontflips: 10
    },
    assertions: (output) => {
      assert.deepEqual(output, [
        { topic: 'testing', popularity: 10 },
        { topic: 'twirling', popularity: 10 },
        { topic: 'frontflips', popularity: 10 }
      ])
    }
  })
})
