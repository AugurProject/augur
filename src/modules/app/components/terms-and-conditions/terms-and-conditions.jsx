import React from 'react'

import Styles from 'modules/app/components/terms-and-conditions/terms-and-conditions.styles'

const TermsAndConditions = p => (
  <div className={Styles.TermsAndConditions}>
    <a
      href="https://augur.net/terms.txt"
      target="blank"
    >
      Terms & Conditions
    </a>
    <a
      href="http://terms.augur.net/"
      target="blank"
    >
      Privacy Policy
    </a>
    <a
      href="https://augur.net/license.txt"
      target="blank"
    >
      Licensing Agreement
    </a>
  </div>
)

export default TermsAndConditions
