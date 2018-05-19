import React, { Component } from 'react'
import PropTypes from 'prop-types'
import QRCode from 'qrcode.react'

import { AppleAppStore, GooglePlayStore } from 'modules/common/components/icons'

import debounce from 'utils/debounce'
import getValue from 'utils/get-value'

import { connectToUport } from 'modules/auth/helpers/connect-to-uport'
import Styles from 'modules/auth/components/uport-connect/uport-connect.styles'

export default class UportConnect extends Component {
  static propTypes = {
    isMobile: PropTypes.bool.isRequired,
    isMobileSmall: PropTypes.bool.isRequired,
    networkId: PropTypes.string.isRequired,
    login: PropTypes.func.isRequired,
  }

  constructor() {
    super()
    this.state = { uri: '', qrSize: 0 }
    this.uPortURIHandler = this.uPortURIHandler.bind(this)
    this.setQRSize = this.setQRSize.bind(this)
    this.debouncedSetQRSize = debounce(this.setQRSize.bind(this))
  }

  componentWillMount() {
    const { login } = this.props
    const uPort = connectToUport(this.props.networkId)
    uPort.requestCredentials({ notifcations: true, accountType: 'keypair' }, this.uPortURIHandler).then((credentials) => {
      login(credentials, uPort)
    })
  }

  componentDidMount() {
    this.setQRSize()
    window.addEventListener('resize', this.debouncedSetQRSize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.debouncedSetQRSize)
  }

  setQRSize() {
    const { isMobile, isMobileSmall } = this.props
    const width = getValue(this, 'uPortCreate.clientWidth')
    if (width) {
      let qrSize
      switch (true) {
        case isMobileSmall:
          qrSize = width / 2.5
          break
        case isMobile:
          qrSize = width / 2.8
          break
        default:
          qrSize = width / 3.5
      }
      this.setState({ qrSize })
    }
  }

  uPortURIHandler(uri) {
    this.setState({ uri })
  }

  render() {
    const s = this.state
    return (
      <section
        ref={(uPortCreate) => { this.uPortCreate = uPortCreate }}
        className={Styles.Uport__connect}
      >
        <div>
          <h3>Connect a uPort Account</h3>
          <QRCode value={s.uri} size={s.qrSize} />
          <h4>Need a uPort Account?</h4>
          <div className={Styles.Uport__apps}>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://play.google.com/store/apps/details?id=com.uportMobile"
            >
              <GooglePlayStore />
            </a>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://itunes.apple.com/us/app/uport-id/id1123434510"
            >
              <AppleAppStore />
            </a>
          </div>
        </div>
      </section>
    )
  }
}
