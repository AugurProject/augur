import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Styles from "./dropdown.styles.less";

// pass in how options will be rendered in array of html, network dropdown will change default menu label, need a line break option
class Dropdown extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showList: false
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

  dropdownSelect(onClick) {
    onClick();
    this.setState({ showList: false });
    this.props.setMenuIsOpen && this.props.setMenuIsOpen(false);
  }

  toggleList() {
    this.props.setMenuIsOpen && this.props.setMenuIsOpen(!this.state.showList);
    this.setState({ showList: !this.state.showList });
  }

  handleWindowOnClick(event) {
    if (this.refDropdown && !this.refDropdown.contains(event.target)) {
      this.setState({ showList: false });
      this.props.setMenuIsOpen &&  this.props.setMenuIsOpen(false);
    }
  }

  render() {
    const { options } = this.props;
    
    return (
      <div
        className={Styles.Dropdown}
        ref={dropdown => {
          this.refDropdown = dropdown;
        }}
      >
        <div className={Styles.Dropdown__label} onClick={this.toggleList}>
          {this.props.children}
        </div>

        <div 
          className={classNames(Styles.Dropdown__menu, {
             [Styles['Dropdown__menu-visible']]: this.state.showList
          })}
        >
          {options.map((option, index) => (
            <div
              key={index}
              className={classNames(Styles.Dropdown__menuItem, {
                [Styles['Dropdown__menuItem-visible']]: this.state.showList
              })}
              onClick={() => this.dropdownSelect(option.onClick)}
            >
              {option.label}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

Dropdown.propTypes = {
  options: PropTypes.array.isRequired,
  setMenuIsOpen: PropTypes.func,
};

export default Dropdown;
