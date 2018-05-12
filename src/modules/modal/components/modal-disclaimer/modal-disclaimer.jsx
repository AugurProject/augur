import React from 'react'

import Styles from 'modules/modal/components/modal-disclaimer/modal-disclaimer.styles'

const ModalDisclaimer = p => (
  <section className={Styles.ModalDisclaimer}>
    <h1>Attention</h1>
    <p>
      I understand that Augur is experimental beta software, and should not trust it with a large amount of funds. I understand that users must comply with all of their local jurisdictional laws (financial, gaming, options or etc) when using the Augur protocol. I understand and take full responsibility for any actions I perform on the Augur protocol, and understand my local jurisdictional laws surrounding my actions Augur.
    </p>
    <div className={Styles.ModalDisclaimer__ActionButtons}>
      <button
        onClick={p.closeModal}
      >
        I have read and understand the above
      </button>
    </div>
  </section>
)

export default ModalDisclaimer
