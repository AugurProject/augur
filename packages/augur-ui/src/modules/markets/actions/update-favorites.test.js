import * as actions from "modules/markets/actions/update-favorites";

describe(`modules/markets/actions/update-favorites.js`, () => {
  test(`should dispatch a toggle favorite action`, () => {
    const marketId = "market123";
    const expected = {
      type: actions.TOGGLE_FAVORITE,
      data: { marketId }
    };
    expect(actions.toggleFavorite(marketId)).toEqual(expected);
  });

  test(`should dispatch a update favorites action`, () => {
    const favorites = ["some favorite", "another favorite"];
    const expected = {
      type: actions.UPDATE_FAVORITES,
      data: { favorites }
    };
    expect(actions.updateFavorites(favorites)).toEqual(expected);
  });
});
