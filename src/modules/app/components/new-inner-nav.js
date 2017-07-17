import React, { Component } from 'react';

class InnerMenuBar extends Component {
  constructor() {
    super();
    this.state = {
      currentMenuIndex: null
    };
  }

  chooseMenuItem(idx) {
    if (this.state.currentMenuIndex !== idx || !this.props.subMenuOpen) {
      this.props.onCycleSubMenu(() => {
        this.setState({ currentMenuIndex: idx });

        // return existence of data to determine menu re-opening
        return (this.props.menuData[idx].children &&
                this.props.menuData[idx].children.length > 0);
      });
    }
  }

  renderItemList() {
    return (
      <ul className='innermenubar'>
        {this.props.menuData.map((item, idx) => <li onClick={() => this.chooseMenuItem(idx)}>{item.title}</li>)}
      </ul>
    );
  }

  renderSubMenu() {
    const menuIndex = this.state.currentMenuIndex;
    return(
      <ul className='submenubar' style={{ left: (110 * this.props.subMenuScalar) }}>
        {(menuIndex !== null) && this.props.menuData[menuIndex].children &&
          this.props.menuData[menuIndex].children.map((item) => <li>{item.title}</li>)
        }
      </ul>
    );
  }

  render() {
    return (
      <div className='inner-menu-container'>
        {this.renderItemList()}
        {this.renderSubMenu()}
      </div>
    );
  }
}

InnerMenuBar.defaultProps = {
  menuData: [
    { title: 'one', children: [ { title: 'childone' }, { title: 'childtwo' } ] },
    { title: 'two', children: [ { title: 'hello' }, { title: 'omg' } ] },
    { title: 'three', },
    { title: 'four', children: [ { title: 'kiraku' }, { title: 'tanuki' } ] },
  ]
};

export default InnerMenuBar;
