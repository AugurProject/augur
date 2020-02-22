import React, { Component } from 'react';
import Box from '3box';
import Comments from '3box-comments-react';

import Styles from 'modules/market/components/market-view/market-view.styles.less';

interface MarketCommentsProps {
  marketId: string;
  colorScheme: string;
  numPosts: number;
  networkId: string;
}

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

  handleLogin = async () => {
    const addresses = await window.ethereum.enable();
    const address = addresses[0];

    const box = await Box.openBox(address, window.ethereum);

    box.onSyncDone(() => this.setState({box, address, isReady: true}));
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
