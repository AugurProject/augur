import React, { Component } from 'react';
import PropTypes from 'prop-types';
import QRCode from 'qrcode.react';

import Link from 'modules/link/components/link';
import AccountExportAirbitz from 'modules/account/components/account-export-airbitz';

import debounce from 'utils/debounce';
import getValue from 'utils/get-value';

export default class AccountExport extends Component {
  static propTypes = {
    privateKey: PropTypes.object.isRequired,
    downloadLoginIDDataString: PropTypes.string.isRequired,
    downloadLoginIDFileName: PropTypes.string.isRequired,
    downloadAccountDataString: PropTypes.string.isRequired,
    downloadAccountFileName: PropTypes.string.isRequired,
    airbitzAccount: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
      qrSize: 0
    };

    this.setQRSize = this.setQRSize.bind(this);
    this.debouncedSetQRSize = debounce(this.setQRSize.bind(this));
  }

  componentDidMount() {
    this.setQRSize();

    window.addEventListener('resize', this.debouncedSetQRSize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.debouncedSetQRSize);
  }

  setQRSize() {
    const width = getValue(this, 'exportData.clientWidth');
    if (width) this.setState({ qrSize: width / 3 });
  }

  render() {
    const p = this.props;
    const s = this.state;

    return (
      <article className="account-export account-sub-view">
        <aside>
          <h4>Export Key File</h4>
          <p>Use either the QR code or download link save a copy of the key file for import into a wallet.</p>
          <p className="notice">NOTE: Augur does not store any user account information and therefore has no ability to restore or recover lost accounts.</p>
          <p className="warning">Do NOT share your downloaded account key file or QR code with anyone as your funds could be stolen.</p>
        </aside>
        <div
          ref={(exportData) => { this.exportData = exportData; }}
          className="account-export-data"
        >
          {!p.airbitzAccount &&
            <div className="account-export-account">
              <QRCode
                value={p.privateKey}
                size={s.qrSize}
              />
              <h4>or</h4>
              <Link
                className="button"
                href={p.downloadAccountDataString}
                download={p.downloadAccountFileName}
              >
                Download Key File
              </Link>
              <Link
                className="button"
                href={p.downloadLoginIDDataString}
                download={p.downloadLoginIDFileName}
              >
                Download Login ID
              </Link>
            </div>
          }
          {p.airbitzAccount &&
            <AccountExportAirbitz
              qrSize={s.qrSize}
              privateKey={p.privateKey}
            />
          }
        </div>
      </article>
    );
  }
}
