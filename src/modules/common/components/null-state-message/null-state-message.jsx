import React from 'react'
import classNames from 'classnames'

import Styles from 'modules/common/components/null-state-message/null-state-message.styles'

const NullStateMessage = p => (
  <article className={classNames(p.className, Styles.NullState)}>
    {!p.message ?
      <span>No Data Available</span> :
      <span>{p.message}</span>
    }
  </article>
)

export default NullStateMessage
