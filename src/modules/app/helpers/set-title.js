import * as views from 'modules/app/constants/views'
import * as titles from 'modules/app/constants/view-titles'

export default function (title, params) {
  if (title) {
    setDocumentTitle(title)
  } else {
    switch (params.page) {
      case views.M: {
        const m = params.m.split('_')

        if (m.length === 1) {
          // TODO -- Improvement: lookup market based on ID
          setDocumentTitle(titles.MARKET)
        } else {
          const title = parseMarketTitle(m)

          setDocumentTitle(title)
        }
        break
      }
      case views.AUTHENTICATION:
        setDocumentTitle(titles.AUTHENTICATION)
        break
      case views.CREATE_MARKET:
        setDocumentTitle(titles.CREATE_MARKET)
        break
      case views.MY_POSITIONS:
        setDocumentTitle(titles.POSITIONS)
        break
      case views.MY_MARKETS:
        setDocumentTitle(titles.MARKETS)
        break
      case views.MY_REPORTS:
        setDocumentTitle(titles.REPORTS)
        break
      case views.TRANSACTIONS:
        setDocumentTitle(titles.TRANSACTIONS)
        break
      case views.ACCOUNT:
        setDocumentTitle(titles.ACCOUNT)
        break
      default:
        setDocumentTitle(titles.DEFAULT)
    }
  }
}

export function parseMarketTitle(m) {
  const title = m.reduce((prev, word, i) => (prev.length < 40 && i + 1 < m.length ? `${prev} ${word}` : prev), '')
  return title.length > 40 ? `${title.substring(0, 40).trim()}...` : `${title.trim()}?`
}

function setDocumentTitle(title) {
  document.title = `${title.toString()} | Augur`
}
