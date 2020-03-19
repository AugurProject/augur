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
    let address = (await provider.enable())[0];

    try {
      box = await Box.create(provider);
      console.log('box ###', box);

      await box.auth(['augurtesteightportis'], {address});
      await box.syncDone;
      console.log('auth done ###');

      const space = await box.openSpace('augurtesteightportis', {});
      await space.syncDone;
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
            spaceName="augurtesteightportis"
            threadName={this.props.marketId}
            adminEthAddr={address}

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

// import React from 'react';
// import { FacebookComments } from 'modules/market/components/common/comments/facebook-comments';
//
// interface MarketCommentsProps {
//   marketId: string;
//   colorScheme: string;
//   numPosts: number;
//   networkId: string;
//   whichCommentPlugin?: string;
// }
//
// export const MarketComments = ({
//   marketId,
//   colorScheme,
//   numPosts,
//   networkId,
//   whichCommentPlugin,
// }: MarketCommentsProps) => {
//   return (
//     whichCommentPlugin === 'facebook' && (
//       <FacebookComments
//         marketId={marketId}
//         colorScheme={colorScheme}
//         numPosts={numPosts}
//         networkId={networkId}
//       />
//     )
//   );
// };
