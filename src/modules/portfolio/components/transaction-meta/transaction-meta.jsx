import React from 'react'
import PropTypes from 'prop-types'

import Styles from 'modules/portfolio/components/transaction-meta/transaction-meta.styles'

const TransactionMeta = ({ meta }) => (
  <ul className={Styles.TransactionMeta}>
    { Object.keys(meta).map(metaTitle => (
      <li key={metaTitle}><span>{ metaTitle }</span><span><span>{ meta[metaTitle] }</span></span></li>
    )) }
  </ul>
)

TransactionMeta.propTypes = {
  meta: PropTypes.object.isRequired,
}

export default TransactionMeta
