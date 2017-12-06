import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Connect } from 'uport-connect'
import QRCode from 'qrcode.react'

import { AppleAppStore, GooglePlayStore } from 'modules/common/components/icons/icons'

import debounce from 'utils/debounce'
import getValue from 'utils/get-value'

import uPortSigningNotifier from 'modules/auth/helpers/uport-signing-notifier'

import Styles from 'modules/auth/components/uport-create/uport-create.styles'

export default class UportCreate extends Component {
  static propTypes = {
    isMobile: PropTypes.bool.isRequired,
    login: PropTypes.func.isRequired
  }

  constructor() {
    super()

    this.uPort = new Connect(
      'AUGUR -- DEV',
      {
        clientId: '2ofGiHuZhhpDMAQeDxjoDhEsUQd1MayECgd'
      },
      uPortSigningNotifier
    )

    this.state = {
      uri: '',
      qrSize: 0
    }

    this.uPortURIHandler = this.uPortURIHandler.bind(this)
    this.setQRSize = this.setQRSize.bind(this)
    this.debouncedSetQRSize = debounce(this.setQRSize.bind(this))
  }

  componentWillMount() {
    this.uPort.requestCredentials({
      notifcations: true
    }, this.uPortURIHandler).then((account) => {
      const signingMethod = this.uPort.getWeb3().eth.sendTransaction
      this.props.login(account, signingMethod)
    })
  }

  componentDidMount() {
    this.setQRSize()

    window.addEventListener('resize', this.debouncedSetQRSize)
  }

  setQRSize() {
    const width = getValue(this, 'uPortCreate.clientWidth')
    if (width) this.setState({ qrSize: this.props.isMobile ? width / 1.2 : width / 3 })
  }

  uPortURIHandler(uri) {
    this.setState({ uri })
  }

  render() {
    const s = this.state

    return (
      <section
        ref={(uPortCreate) => { this.uPortCreate = uPortCreate }}
        className={Styles.Uport__create}
      >
        <h3>Create a uPort Account</h3>
        <h4>1. Download the uPort App + Create Account</h4>
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
        <h4>2. Scan the QR Code</h4>
        <QRCode
          value={s.uri}
          size={s.qrSize}
        />
      </section>
    )
  }
}
