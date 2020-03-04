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
    provider: null,
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

    if (accountType && provider) {
      return {
        address,
        accountType,
        provider: provider,
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
    const { provider } = await this.getWalletInfo();

    if (!provider) {
      this.setState({isReady: false});
      return;
    }

    let box;
    let address = (await window.ethereum.enable())[0];
    // let address = (await provider.enable())[0];
    // let address = (await window.portis.provider.enable())[0];

    try {
      // box = await Box.openBox({address}, provider);
      // await box.onSyncDone();

      // const box = await Box.openBox(adminEthAddr, ethereum);
      // const space = await box.openSpace(spaceName, spaceOpts);
      // box = await Box.openBox("0x48903df4d9b4d224f9f2306e408447d689546ef4", provider._web3Provider);
      // const space = await box.openSpace('augur', {});

      box = await Box.create(provider);
      console.log('box ###', box);

      await box.auth(['augur123123123'], {address});
      console.log('auth done ###');

      await box.syncDone;

      const space = await box.openSpace('augur123123123', {});
      await space.syncDone;

      console.log('box sync done ###');
    } catch (error) {
      console.error(error);
      // return
    }

    this.setState({box, address, isReady: true, provider});
  };

  render () {
    const {
      box,
      address,
      isReady,
      provider
    } = this.state;

    return (
      <section className={Styles.Comments}>
        {isReady && (
          <Comments
            // required
            spaceName="augur123123123"
            threadName={this.props.marketId}
            adminEthAddr="0x48903df4d9b4d224f9f2306e408447d689546ef4"

            // Required props for context A) & B)
            box={box}
            currentUserAddr={address}

            // Required prop for context B
            // loginFunction={this.handleLogin}

            // Required prop for context C)
            // ethereum={provider._web3Provider}

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
