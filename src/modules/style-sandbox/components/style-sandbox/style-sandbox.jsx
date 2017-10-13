import React from 'react'
import PropTypes from 'prop-types'

import Styles from 'modules/style-sandbox/components/style-sandbox/style-sandbox.styles'

import NavPanel from 'modules/common/components/nav-panel/nav-panel'
import AccIcon from 'modules/common/components/nav-account-icon'

import MarketCard from 'modules/market/components/market-card/market-card'

export default class StyleSandbox extends React.Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };

  constructor() {
    super()
    this.state = {
      flipNav: false
    }
  }

  render() {
    const navPanelProps = {
      flipped: this.state.flipNav,
      history: this.props.history,
      items: [
        { title: 'hello1', iconComponent: AccIcon },
        { title: 'hello2', iconComponent: AccIcon },
        { title: 'hello3', iconComponent: AccIcon },
        { title: 'hello4', iconComponent: AccIcon },
        { title: 'hello5', iconComponent: AccIcon },
        { title: 'hello6', iconComponent: AccIcon }
      ],
      location: this.props.location
    }

    return (
      <div className={Styles.StyleSandbox}>
        <div className={Styles['StyleSandbox__nav-panel-wrap']}>
          <NavPanel {...navPanelProps}>
            Placeholder - content will come when appropriate component is available
            <br />
            <button onClick={() => this.setState({ flipNav: !this.state.flipNav })}>Flip Nav</button>
          </NavPanel>
        </div>
        <MarketCard />
      </div>
    )
  }
}
