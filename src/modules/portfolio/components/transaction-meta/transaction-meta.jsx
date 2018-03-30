import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Styles from 'modules/portfolio/components/transaction-meta/transaction-meta.styles'

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
    const p = this.props
    const baseLink = p.networkId ? TransactionMeta.networkLink[p.networkId] : null

    return (
      <ul className={Styles.TransactionMeta}>
        { Object.keys(p.meta).filter(metaTitle => metaTitle === 'txhash').map(metaTitle => (
          <li key={metaTitle}><span>{ metaTitle }</span>
            <span>
              { baseLink &&
              <a
                href={baseLink + p.meta[metaTitle]}
                target="blank"
              >
                {p.meta[metaTitle]}
              </a>
              }
              { !baseLink &&
                <span>{ p.meta[metaTitle] }</span>
              }
            </span>
          </li>
        )) }
        { Object.keys(p.meta).filter(metaTitle => metaTitle !== 'txhash').map(metaTitle => (
          <li key={metaTitle}><span>{ metaTitle }</span><span><span>{ p.meta[metaTitle] }</span></span></li>
        )) }
      </ul>
    )
  }
}
