import { describe, it } from 'mocha';
import { assert } from 'chai';
import * as actions from 'modules/markets/actions/update-favorites';


describe(`modules/markets/actions/update-favorites.js`, () => {
	it(`should dispatch a toggle favorite action`, () => {
		const marketID = 'market123';
		const expectedOutput = {
			type: actions.TOGGLE_FAVORITE,
			marketID
		};
		assert.deepEqual(actions.toggleFavorite(marketID), expectedOutput, `toggle favorite action didn't return the correct object`);
	});

	it(`should dispatch a update favorites action`, () => {
		const favorites = ['some favorite', 'another favorite'];
		const expectedOutput = {
			type: actions.UPDATE_FAVORITES,
			favorites
		};
		assert.deepEqual(actions.updateFavorites(favorites), expectedOutput, `update favorites didn't return the correct object`);
	});
});
