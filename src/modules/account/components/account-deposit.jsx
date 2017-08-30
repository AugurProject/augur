import React, { Component } from 'react'
import PropTypes from 'prop-types'
import QRCode from 'qrcode.react'

import debounce from 'utils/debounce'
import getValue from 'utils/get-value'
import fitText from 'utils/fit-text'

export default class AccountDeposit extends Component {
  static propTypes = {
    address: PropTypes.string.isRequired,
    isMobile: PropTypes.bool.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      qrSize: 0
    }

    this.setQRSize = this.setQRSize.bind(this)
    this.setAddressScale = this.setAddressScale.bind(this)
    this.debouncedSetQRSize = debounce(this.setQRSize.bind(this))
    this.debouncedSetAddressScale = debounce(this.setAddressScale.bind(this))
  }

  componentDidMount() {
    this.setQRSize()
    this.setAddressScale()

    window.addEventListener('resize', this.debouncedSetQRSize)
    window.addEventListener('resize', this.debouncedSetAddressScale)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.debouncedSetQRSize)
    window.removeEventListener('resize', this.debouncedSetAddressScale)
  }

  setQRSize() {
    const width = getValue(this, 'depositData.clientWidth')
    if (width) this.setState({ qrSize: this.props.isMobile ? width / 1.2 : width / 3 })
  }

  setAddressScale() {
    fitText(this.depositData, this.depositAddress, true)
  }

  render() {
    const p = this.props
    const s = this.state

    return (
      <article className="account-deposit account-sub-view">
        <aside>
          <h3>Deposit Funds To Account</h3>
          <p className="warning">DO NOT deposit mainnet ETH or REP.</p>
          <p>Scan the QR code or copy the full account address to transfer funds to your account.</p>
        </aside>
        <div
          ref={(depositData) => { this.depositData = depositData }}
          className="account-deposit-data"
        >
          <QRCode
            value={p.address}
            size={s.qrSize}
          />
          <span
            ref={(depositAddress) => { this.depositAddress = depositAddress }}
            className="account-deposit-address"
          >
            {p.address}
          </span>
        </div>
      </article>
    )
  }
}
