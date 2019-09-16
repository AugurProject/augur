import React, { Component } from 'react';
import classNames from 'classnames';

import PropTypes from 'prop-types';
import Styles from 'modules/market/components/market-view/market-view.styles.less';

export default class MarketComments extends Component {
  static propTypes = {
    marketId: PropTypes.string.isRequired,
    colorScheme: PropTypes.string.isRequired,
    dataWidth: PropTypes.string.isRequired,
  };

  static defaultProps = {
    marketId: PropTypes.string.isRequired,
    colorScheme: PropTypes.string.isRequired,
    dataWidth: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      marketId,
      colorScheme,
      dataWidth,
    } = this.props;

    let content = null;

    content = (
      <div id='fb-comments-container'>
        <div id='fb-comments' className='fb-comments' data-colorscheme={colorScheme} data-href={'www.augur.net/comments/marketId=' + marketId} data-width={dataWidth} data-numposts='10'></div>
      </div>
    );

    if (!window.document.getElementById('fb-root')) {
      const fbRoot = window.document.createElement('div');
      fbRoot.id = 'fb-root';
      const js = window.document.createElement('script');
      js.id = 'facebook-jssdk';
      js.async = true;
      js.defer = true;
      js.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v4.0';
      window.document.body.appendChild(fbRoot);
      window.document.body.appendChild(js);
    }

    return (
      <>
      {content}
      </>
    );
  }
}
