import { assert } from 'chai';
import assertLink from '../../test/assertions/common/link';


export default function(links) {
	describe('augur-ui-react-components links state', () => {
		assert.isDefined(links, `links isn't defined`);
		assert.isObject(links, `links isn't an object`);

		it('authLink', () => {
			assertLink(links.authLink, 'links');
		});

		it('marketsLink', () => {
			assertLink(links.marketsLink, 'links');
		});

		it('transactionsLink', () => {
			assertLink(links.transactionsLink, 'links');
		});

		it('marketLink', () => {
			assertLink(links.marketLink, 'links');
		});

		it('previousLink', () => {
			assertLink(links.previousLink, 'links');
		});

		it('createMarketLink', () => {
			assertLink(links.createMarketLink, 'links');
		});
	});
};
