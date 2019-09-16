import React, { Component } from 'react';
import classNames from 'classnames';

import Styles from 'modules/market/components/market-view/market-view.styles.less';

export default class MarketComments extends Component {
  static propTypes = {
  };

  static defaultProps = {
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let content = null;
    content = (
      <div className={classNames(Styles.MarketView_comments)}>
        <div id='fb-root'></div>
        <script async defer crossOrigin='anonymous' src='https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v4.0'></script>
        <div className='fb-comments' data-colorscheme='dark' data-href='www.augur.net' data-width='550' data-numposts='10'></div>
      </div>
    );

    return (
      <>
      {content}
      </>
    );
  }
}
