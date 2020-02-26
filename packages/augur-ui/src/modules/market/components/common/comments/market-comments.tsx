import React, { Component } from 'react';
import Box from '3box';
import Comments from '3box-comments-react';

import Styles from 'modules/market/components/market-view/market-view.styles.less';
import { ACCOUNT_TYPES } from 'modules/common/constants';

export class MarketComments extends Component {
  state = {
    box: {},
    myProfile: {},
    address: '',
    isReady: false,
  };

  componentDidMount() {
    this.handleLogin();
  };

  componentDidUpdate(prevProps, prevState): void {
    if (prevProps.provider !== this.props.provider
      || prevProps.address !== this.props.address
      || prevProps.accountType !== this.props.accountType) {
      console.log('componentDidUpdate');
      this.handleLogin();
    }
  }

  getProvider = (accountType) => {
    const provider = {
      [ACCOUNT_TYPES.PORTIS]: window.portis.provider,
      default: null
    };

    return (provider[accountType] || provider['default'])();
  };

  getWalletInfo = async () => {
    const {address, accountType, provider} = this.props;

    if (address && accountType && provider) {
      return {
        address,
        accountType,
        provider,
      }
    } else if (window.ethereum) {
      const addresses = await window.ethereum.enable();
      const address = addresses[0];

      return {
        address,
        accountType: ACCOUNT_TYPES.METAMASK,
        provider: window.ethereum,
      }
    } else {
      return {}
    }
  };

  handleLogin = async () => {
    const { address, provider } = await this.getWalletInfo();
    if (!address) {
      this.setState({isReady: false});
      return;
    }

    console.log('address and provider #####', {address, provider});

    const box = await Box.create(provider);
    console.log('box ###', box);

    await box.auth(['augur'], {address});
    console.log('auth done ###');

    await box.syncDone;
    console.log('box sync done ###');

    this.setState({box, address, isReady: true});
  };

  render () {
    const {
      box,
      address,
      isReady,
    } = this.state;

    return (
      <section className={Styles.Comments}>
        {isReady && (
          <Comments
            // required
            spaceName="augur"
            threadName={this.props.marketId}
            adminEthAddr="0x913dA4198E6bE1D5f5E4a40D0667f70C0B5430Eb"

            // Required props for context A) & B)
            box={box}
            currentUserAddr={address}

            // Required prop for context B
            // loginFunction={this.handleLogin}

            // Required prop for context C)
            // ethereum={window.ethereum}

            // optional
            // members={false}
            // showCommentCount={10}
            // threadOpts={{}}
            // useHovers={false}
            // currentUser3BoxProfile={currentUser3BoxProfile}
            // userProfileURL={address => `https://mywebsite.com/user/${address}`}
          />
        )}
      </section>
    );
  }
}
