import React, { Component } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import QRCode from 'qrcode.react'
import Clipboard from 'clipboard'

import { Export as ExportIcon } from 'modules/common/components/icons/icons'

import Styles from 'modules/new-account/components/account-export/account-export.styles'

export default class AccountExport extends Component {
  static propTypes = {
    privateKey: PropTypes.string.isRequired
  }

  constructor() {
    super()
    this.state = {
      blurred: true
    }
  }

  render() {
    const p = this.props

    return (
      <section className={Styles.AccountExport}>
        <div className={Styles.AccountExport__heading}>
          <h1>Account: Export</h1>
          { ExportIcon }
        </div>
        <div className={Styles.AccountExport__main}>
          <div className={Styles.AccountExport__description}>
            <p>
              Export your account private key.
            </p>
          </div>
          <div className={Styles.AccountExport__qrZone}>
            {this.state.blurred &&
              <span className={Styles.AccountExport__blurText}>
                Reveal QR
              </span>
            }
            <div
              className={classNames(
                Styles.AccountExport__qrBlur,
                { [Styles['AccountExport__qrBlur-blurred']]: this.state.blurred }
              )}
              onClick={() => this.setState({ blurred: false })}
            >
              <QRCode
                value={p.privateKey}
                size={124}
              />
            </div>
          </div>
          <div className={Styles.AccountExport__keystore}>
            <a
              className={Styles.AccountExport__keystoreButton}
              href={p.downloadAccountDataString}
              download={p.downloadAccountFileName}
            >
              Download Keystore
            </a>
          </div>
        </div>
      </section>
    )
  }
}
