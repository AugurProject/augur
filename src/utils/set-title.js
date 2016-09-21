import * as pages from '../modules/app/constants/pages';
import * as titles from '../modules/app/constants/page-titles';

export default function (title, params) {
	if (!!title) {
		setDocumentTitle(title);
	} else {
		switch (params.page) {
		case pages.M: {
			const m = params.m.split('_');

			if (m.length === 1) {
				// TODO -- Improvement: lookup market based on ID
				setDocumentTitle(titles.MARKET);
			} else {
				const title = parseMarketTitle(m);

				setDocumentTitle(title);
			}
			break;
		}
		case pages.REGISTER:
			setDocumentTitle(titles.REGISTER);
			break;
		case pages.LOGIN:
			setDocumentTitle(titles.LOGIN);
			break;
		case pages.IMPORT:
			setDocumentTitle(titles.IMPORT);
			break;
		case pages.MAKE:
			setDocumentTitle(titles.CREATE);
			break;
		case pages.MY_POSITIONS:
			setDocumentTitle(titles.POSITIONS);
			break;
		case pages.MY_MARKETS:
			setDocumentTitle(titles.MARKETS);
			break;
		case pages.MY_REPORTS:
			setDocumentTitle(titles.REPORTS);
			break;
		case pages.TRANSACTIONS:
			setDocumentTitle(titles.TRANSACTIONS);
			break;
		case pages.ACCOUNT:
			setDocumentTitle(titles.ACCOUNT);
			break;
		case pages.LOGIN_MESSAGE:
			setDocumentTitle(titles.WELCOME);
			break;
		default:
			setDocumentTitle(titles.DEFAULT);
		}
	}
}

export function parseMarketTitle(m) {
	const title = m.reduce((prev, word, i) => (prev.length < 40 && i + 1 < m.length ? `${prev} ${word}` : prev), '');
	return title.length > 40 ? `${title.substring(0, 40).trim()}...` : `${title.trim()}?`;
}

function setDocumentTitle(title) {
	document.title = `${title.toString()} | Augur`;
}
