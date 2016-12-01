import { describe, it, beforeEach } from 'mocha';
import { assert } from 'chai';

import * as setTitle from '../../src/utils/set-title';

import * as pages from '../../src/modules/app/constants/views';
import * as titles from '../../src/modules/app/constants/page-titles';

describe('utils/set-title.js', () => {
	beforeEach(() => {
		global.document = {};
	});

	it('should set the title if one is explicitly passed in', () => {
		setTitle.default('testing');

		assert.strictEqual(global.document.title, 'testing | Augur', 'title not set to expected value');
	});

	Object.keys(pages).forEach(page => {
		const currentPage = pages[page];

		it(`should correctly set the page title for the ${currentPage} page`, () => {
			if (currentPage !== pages.M) {
				setTitle.default(null, { page: currentPage });

				testPageTitle(currentPage);
			} else {
				describe('market pages', () => {
					const page = pages.M;
					let m;

					it(`should correctly set the page title for a market path WITH a description < 40 characters`, () => {
						m = 'Some_title_here_0xtest';

						setTitle.default(null, { page, m });

						testPageTitle(page, m);
					});

					it(`should correctly set the page title for a market path WITH description > 40 characters`, () => {
						m = 'Some_title_here_that_is_fairly_long_as_well_as_quite_verbose_0xtest';

						setTitle.default(null, { page, m });

						testPageTitle(page, m, true);
					});

					it(`should correctly set the page title for a market path WITHOUT description`, () => {
						m = '0xtest';
						setTitle.default(null, { page, m });

						testPageTitle(page, m);
					});
				});
			}
		});
	});
});

function testPageTitle(page, description, long) {
	let expected;
	const appended = ' | Augur';
	const	title = global.document.title || '';

	switch (page) {
		case pages.M: {
			const m = description.split('_');

			if (m.length === 1) {
				expected = titles.MARKET;

				assert.strictEqual(title, expected + appended, `title for ${page} page WITHOUT description not set to expected value`);
			} else {
				if (!!long) {
					expected = 'Some title here that is fairly long as...'; // Specifically tests appropriate truncation when final word is added that causes string to be longer than 40 characters

					assert.strictEqual(title, expected + appended, `title for ${page} page WITH long description not set to expected value`);
				} else {
					expected = 'Some title here?';

					assert.strictEqual(title, expected + appended, `title for ${page} page WITH short description not set to expected value`);
				}
			}
			break;
		}
		case pages.REGISTER:
			expected = titles.REGISTER;

			assert.strictEqual(title, expected + appended, `title for ${page} page not set to expected value`);
			break;
		case pages.LOGIN:
			expected = titles.LOGIN;

			assert.strictEqual(title, expected + appended, `title for ${page} page not set to expected value`);
			break;
		case pages.IMPORT:
			expected = titles.IMPORT;

			assert.strictEqual(title, expected + appended, `title for ${page} page not set to expected value`);
			break;
		case pages.MAKE:
			expected = titles.CREATE;

			assert.strictEqual(title, expected + appended, `title for ${page} page not set to expected value`);
			break;
		case pages.MY_POSITIONS:
			expected = titles.POSITIONS;

			assert.strictEqual(title, expected + appended, `title for ${page} page not set to expected value`);
			break;
		case pages.MY_MARKETS:
			expected = titles.MARKETS;

			assert.strictEqual(title, expected + appended, `title for ${page} page not set to expected value`);
			break;
		case pages.MY_REPORTS:
			expected = titles.REPORTS;

			assert.strictEqual(title, expected + appended, `title for ${page} page not set to expected value`);
			break;
		case pages.TRANSACTIONS:
			expected = titles.TRANSACTIONS;

			assert.strictEqual(title, expected + appended, `title for ${page} page not set to expected value`);
			break;
		case pages.ACCOUNT:
			expected = titles.ACCOUNT;

			assert.strictEqual(title, expected + appended, `title for ${page} page not set to expected value`);
			break;
		case pages.LOGIN_MESSAGE:
			expected = titles.WELCOME;

			assert.strictEqual(title, expected + appended, `title for ${page} page not set to expected value`);
			break;
		default:
			expected = titles.DEFAULT;

			assert.strictEqual(title, expected + appended, `title for ${page} page not set to expected value`);
	}
}
