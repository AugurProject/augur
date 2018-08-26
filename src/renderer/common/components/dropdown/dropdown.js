import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Styles from "./dropdown.styles.less";

// pass in how options will be rendered in array of html, network dropdown will change default menu label, need a line break option
class Dropdown extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showList: false,
    };

    this.toggleList = this.toggleList.bind(this);
    this.handleWindowOnClick = this.handleWindowOnClick.bind(this);
  }

  componentDidMount() {
    window.addEventListener("click", this.handleWindowOnClick);
  }

  componentWillUnmount() {
    window.removeEventListener("click", this.handleWindowOnClick);
  }

  toggleList() {
    this.props.setMenuIsOpen && this.props.setMenuIsOpen(!this.state.showList);
    this.setState({ showList: !this.state.showList });
  }

  handleWindowOnClick(event) {
    const modal = document.getElementById('modal');
    const editModal = document.getElementById('editModal');

    if (modal || editModal) {
      if (event.target === modal || modal.contains(event.target) ||
        event.target === editModal && editModal.contains(event.target)) {
        return;
      }
    }
    
    if (this.refDropdown && !this.refDropdown.contains(event.target) || 
      this.refDropdownItems && this.refDropdownItems.contains(event.target)) {
      this.setState({ showList: false });
      this.props.setMenuIsOpen &&  this.props.setMenuIsOpen(false);
    }
  }

  render() {
    const { options, big } = this.props;
    
    return (
      <div
        className={Styles.Dropdown}
        ref={dropdown => {
          this.refDropdown = dropdown;
        }}
      >
        <div className={Styles.Dropdown__label} onClick={this.toggleList}>
          {this.props.button}
        </div>

        <div 
          className={classNames(Styles.Dropdown__menu, {
            [Styles['Dropdown__menuBig']]: big,
             [Styles['Dropdown__menu-visible']]: this.state.showList && !big,
             [Styles['Dropdown__menuBig-visible']]: this.state.showList && big,
          })}
          ref={dropdownItems => {
            this.refDropdownItems = dropdownItems;
          }}
        >
          {this.props.children}
        </div>
      </div>
    );
  }
}

Dropdown.propTypes = {
  button: PropTypes.array.isRequired,
  setMenuIsOpen: PropTypes.func,
  big: PropTypes.bool,
};

export default Dropdown;
