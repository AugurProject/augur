import React, { Component } from 'react';
import Routes from 'modules/app/components/routes';


class MainContent extends Component {
  render() {
    return (
      <div className='maincontent'>
        {this.props.children}
      </div>
    );
  }
}

export default MainContent;
