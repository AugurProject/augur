import React from 'react'
import QRCode from 'qrcode.react'

import Styles from 'modules/modal/components/modal-uport/modal-uport.styles'

const ModalUport = (p) => {
  function qrSize() {
    // Height is the constraining value
    if (p.modalWidth > p.modalHeight) return p.modalHeight / 2 > 300 ? 300 : p.modalHeight / 2
    // Width is the constraining value
    return p.modalWidth / 3 > 300 ? 300 : p.modalWidth / 3
  }

  return (
    <section className={Styles.ModalUport} >
      <div className={Styles.ModalUport__header}>
        <h1>Sign Transaction</h1>
      </div>
      {p.uri &&
        <div className={Styles.ModalUport__qr}>
          <QRCode
            value={p.uri}
            size={qrSize()}
          />
        </div>
      }
      {p.error &&
        <span>{p.error}</span>
      }
    </section>
  )
}

export default ModalUport
