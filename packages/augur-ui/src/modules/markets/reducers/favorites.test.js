import reducer from "modules/markets/reducers/favorites";
import {
  UPDATE_FAVORITES,
  TOGGLE_FAVORITE
} from "modules/markets/actions/update-favorites";

describe(`modules/markets/reducers/favorites.js`, () => {
  test(`should return an update favorites action with new favorites data`, () => {
    const someDate = Date.now();
    const anotherDate = Date.now();
    const favorites = {
      fav1: anotherDate
    };
    const currentFavorites = {
      fav1: someDate
    };
    const testAction = {
      type: UPDATE_FAVORITES,
      data: { favorites }
    };
    const expected = {
      fav1: anotherDate
    };
    expect(reducer(currentFavorites, testAction)).toEqual(expected);

    expect(reducer(undefined, testAction)).toEqual(expected);
  });

  test(`should be able to toggle favorites`, () => {
    const someDate = Date.now();
    const currFavorites = {
      test: someDate,
      test2: someDate,
      test3: someDate
    };
    const expected = {
      test: someDate,
      test3: someDate
    };
    const action = {
      type: TOGGLE_FAVORITE,
      data: { marketId: "test2" }
    };

    expect(reducer(undefined, action).test2).toBeDefined();
    expect(reducer(currFavorites, action)).toEqual(expected);
  });
});
