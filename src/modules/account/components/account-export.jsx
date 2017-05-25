import React, { Component, PropTypes } from 'react';

export default class AccountExport extends Component {
  static propTypes = {
    airbitzAccount: PropTypes.object,
    downloadAccountDataString: PropTypes.string,
    downloadAccountFile: PropTypes.string
  };

  constructor(props) {
    super(props);

    this.state = {

    };
  }

  render() {
    return (
      <article className="account-export account-sub-view">
        <aside>
          <h4>Export Key File</h4>
          <p>Use either the QR code or download link save a copy of the key file for import into a wallet.</p>
          <p className="notice">NOTE: Augur does not store any user account information and therefore has no ability to restore or recover lost accounts.</p>
          <p className="warning">Do NOT share your downloaded account key file or QR code with anyone. Your funds could be stolen.</p>
        </aside>
        <div>
          <span>Export here...</span>
        </div>
      </article>
    );
  }
}
