import React, { Component } from 'react'
import QRCode from 'qrcode.react'

import debounce from 'utils/debounce'
import getValue from 'utils/get-value'

import Styles from 'modules/modal/components/modal-uport/modal-uport.styles'

export default class ModalUport extends Component {
  constructor(props) {
    super(props)

    this.state = {
      qrSize: 0
    }

    this.setQRSize = this.setQRSize.bind(this)
    this.debouncedSetQRSize = debounce(this.setQRSize.bind(this))
  }

  componentDidMount() {
    this.setQRSize()

    window.addEventListener('resize', this.debouncedSetQRSize)
  }

  setQRSize() {
    const width = getValue(this, 'uPortQR.clientWidth')
    const height = getValue(this, 'uPortQR.clientHeight')

    if (width > height) { // Height is the constraining value
      this.setState({ qrSize: height / 1.2 })
    } else { // Width is the constraining value
      this.setState({ qrSize: width / 3 })
    }
  }

  render() {
    const s = this.state
    const p = this.props

    return (
      <section className={Styles.ModalUport}>
        <div className={Styles.ModalUport__header}>
          <h1>Sign Transaction</h1>
        </div>
        <div
          ref={(uPortQR) => { this.uPortQR = uPortQR }}
          className={Styles.ModalUport__qr}
        >
          <QRCode
            value={p.uri}
            size={s.qrSize}
          />
        </div>
        {p.error &&
          <span>{p.error}</span>
        }
      </section>
    )
  }

}
