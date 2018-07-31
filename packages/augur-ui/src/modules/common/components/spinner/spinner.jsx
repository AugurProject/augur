import React from 'react'
import classNames from 'classnames'

import Styles from 'modules/common/components/spinner/spinner.styles'

const Spinner = p => (
  <article className={Styles.Spinner} >
    <div className={
      classNames(
        Styles.Spinner__icon,
        {
          [Styles[`Spinner__icon--light`]]: p.light,
        },
      )}
    />
  </article>
)

export default Spinner
