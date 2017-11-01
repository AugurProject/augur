import React from 'react'

import Styles from 'modules/portfolio/components/transaction-meta/transaction-meta.styles'

const TransactionMeta = ({ meta }) => (
  <ul className={Styles.TransactionMeta}>
    { Object.keys(meta).map(meta_title => (
      <li key={meta_title}><span>{ meta_title }</span><span>{ meta[meta_title] }</span></li>
    )) }
  </ul>
)

export default TransactionMeta
