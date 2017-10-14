import React, { Component } from 'react'
import PropTypes from 'prop-types'
import QRCode from 'qrcode.react'
import Clipboard from 'clipboard'

import { Export as ExportIcon, Copy as CopyIcon } from 'modules/common/components/icons/icons'

import Styles from 'modules/new-account/components/account-export/account-export.styles'

export default class AccountExport extends Component {
  static propTypes = {
    privateKey: PropTypes.string.isRequired
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
            <div
              className={classNames(
                Styles.AccountExport__qrBlur,
                { [Styles['AccountExport__qrBlur-blurred']]: this.state.blurred }
              )}
            >
              <QRCode
                value={p.privateKey}
                size={124}
              />
            </div>
          <div className={Styles.AccountExport__keystore}>
            <button
              className={Styles.AccountExport__keystoreButton}
            >
              Download Keystore
            </button>
          </div>
        </div>
      </section>
    )
  }
}
