

import reducer from 'modules/markets/reducers/favorites'
import { UPDATE_FAVORITES, TOGGLE_FAVORITE } from 'modules/markets/actions/update-favorites'

describe(`modules/markets/reducers/favorites.js`, () => {
  it(`should return an update favorites action with new favorites data`, () => {
    const someDate = Date.now()
    const anotherDate = Date.now()
    const favorites = {
      fav1: anotherDate,
    }
    const currentFavorites = {
      fav1: someDate,
    }
    const testAction = {
      type: UPDATE_FAVORITES,
      favorites,
    }
    const expectedOutput = {
      fav1: anotherDate,
    }
    assert.deepEqual(reducer(currentFavorites, testAction), expectedOutput, `Reducer didn't update correctly given favorites`)
    assert.deepEqual(reducer(undefined, testAction), expectedOutput, `Reducer didn't output correctly given empty favorites`)
  })

  it(`should be able to toggle favorites`, () => {
    const someDate = Date.now()
    const currFavorites = {
      test: someDate,
      test2: someDate,
      test3: someDate,
    }
    const expectedOutput = {
      test: someDate,
      test3: someDate,
    }
    const action = {
      type: TOGGLE_FAVORITE,
      marketId: 'test2',
    }

    assert.isDefined(reducer(undefined, action).test2, `cannot toggle a favorite that doesn't exist.`)
    assert.deepEqual(reducer(currFavorites, action), expectedOutput, `cannot untoggle a favorite that already exists`)
  })

})
