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
    this.toggleList();
  }

  toggleList() {
    this.setState({ showList: !this.state.showList });
  }

  handleWindowOnClick(event) {
    if (this.refDropdown && !this.refDropdown.contains(event.target)) {
      this.setState({ showList: false });
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
        {this.state.showList && 
          <div className={Styles['Dropdown__menu']}>
            {options.map((option, index) => (
              <div
                key={index}
                className={Styles['Dropdown__menu-item']}
                onClick={() => this.dropdownSelect(option.onClick)}
              >
                {option.label}
              </div>
            ))}
          </div>
        }
      </div>
    );
  }
}

Dropdown.propTypes = {
  options: PropTypes.array.isRequired,
};

export default Dropdown;
