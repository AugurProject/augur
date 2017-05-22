import React, { Component, PropTypes } from 'react';

import EtherLogo from 'modules/common/components/ether-logo';

export default class AccountConvert extends Component {
  static propTypes = {

  };

  render() {
    return (
      <article className="account-convert account-sub-view">
        <aside>
          <h3>Convert Account Ether</h3>
          <p>All trading on Augur is conducted with ETH Tokens, which are exchanges one-to-one with ETH.</p>
        </aside>
        <div className="account-convert-actions account-actions">
          <EtherLogo />
        </div>
      </article>
    );
  }
}
