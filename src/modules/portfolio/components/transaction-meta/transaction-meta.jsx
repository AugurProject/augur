import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Styles from 'modules/portfolio/components/transaction-meta/transaction-meta.styles'

import { convertUnixToFormattedDate } from 'utils/format-date'

export default class TransactionMeta extends Component {
  static propTypes = {
    meta: PropTypes.object.isRequired,
    networkId: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]).isRequired,
  }

  static networkLink = {
    1: 'https://etherscan.io/tx/',
    4: 'https://rinkeby.etherscan.io/tx/',
  }

  render() {
    const {
      meta,
      networkId,
    } = this.props
    const baseLink = networkId ? TransactionMeta.networkLink[networkId] : null

    if (typeof meta.timestamp === 'number') {
      meta.timestamp = convertUnixToFormattedDate(meta.timestamp).full
    }

    return (
      <ul className={Styles.TransactionMeta}>
        { Object.keys(meta).filter(metaTitle => metaTitle === 'txhash').map(metaTitle => (
          <li key={metaTitle}><span>{ metaTitle }</span>
            <span>
              { baseLink &&
              <a
                href={baseLink + meta[metaTitle]}
                target="blank"
              >
                {meta[metaTitle]}
              </a>
              }
              { !baseLink &&
                <span>{ meta[metaTitle] }</span>
              }
            </span>
          </li>
        )) }
        { Object.keys(meta).filter(metaTitle => metaTitle !== 'txhash').map(metaTitle => (
          <li key={metaTitle}><span>{ metaTitle }</span><span><span>{ meta[metaTitle] }</span></span></li>
        )) }
      </ul>
    )
  }
}
