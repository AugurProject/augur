import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import ModulePane from "modules/market/components/common/module-tabs/module-pane";
import Styles from "modules/market/components/common/module-tabs/module-tabs.style";

export default class ModuleTabs extends Component {
  static propTypes = {
    className: PropTypes.string,
    selected: PropTypes.number,
    children: PropTypes.arrayOf(ModulePane).isRequired,
    fillWidth: PropTypes.bool,
    fillForMobile: PropTypes.bool,
    noBorder: PropTypes.bool,
    id: PropTypes.string,
    borderBetween: PropTypes.bool,
    leftButton: PropTypes.element,
    scrollOver: PropTypes.bool
  };

  static defaultProps = {
    selected: 0,
    className: "",
    fillWidth: false,
    fillForMobile: false,
    id: "id",
    noBorder: false,
    borderBetween: false,
    leftButton: null,
    scrollOver: false
  };

  constructor(props) {
    super(props);

    this.state = {
      selected: props.selected
    };

    this.handleClick = this.handleClick.bind(this);
    this.renderTabs = this.renderTabs.bind(this);
    this.renderContent = this.renderContent.bind(this);
  }

  handleClick(e, index) {
    if (e) e.preventDefault();
    this.setState({
      selected: index
    });
  }

  renderTabs() {
    function labels(child, index) {
      return (
        <li
          key={index}
          className={classNames({
            [Styles.ModuleTabs__activeTab]: this.state.selected === index,
            [Styles.ModuleTabs__activeTabFill]:
              this.state.selected === index && this.props.fillWidth
          })}
        >
          <button
            onClick={e => {
              this.handleClick(e, index);
            }}
          >
            <span
              className={classNames({
                [Styles.ModuleTabs__activeSpanFill]:
                  this.state.selected === index && this.props.fillWidth,
                [Styles.ModuleTabs__activeNoBorder]:
                  this.state.selected === index && this.props.noBorder,
                [Styles.ModuleTabs__activeBorderBetween]:
                  this.state.selected === index && this.props.borderBetween,
                [Styles.ModuleTabs__isNew]: child.props.isNew
              })}
            >
              {child.props.label}
            </span>
          </button>
        </li>
      );
    }

    return (
      <div className={Styles.ModuleTabs__headers}>
        {this.props.leftButton}
        <ul
          className={classNames(Styles.ModuleTabs__tab, {
            [Styles.ModuleTabs__tabFill]: this.props.fillWidth,
            [Styles.ModuleTabs__tabFillWidth]:
              this.props.fillWidth || this.props.fillForMobile,
            [Styles.ModuleTabs__noBorder]: this.props.noBorder,
            [Styles.ModuleTabs__borderBetween]: this.props.borderBetween
          })}
        >
          {this.props.children.map(labels.bind(this))}
        </ul>
      </div>
    );
  }

  renderContent() {
    return (
      <div className={Styles.ModuleTabs__content}>
        {this.props.children[this.state.selected]}
      </div>
    );
  }

  render() {
    return (
      <div
        className={classNames(Styles.ModuleTabs, this.props.className, {
          [Styles.ModuleTabs__scrollOver]: this.props.scrollOver
        })}
        id={"tabs_" + this.props.id}
      >
        {this.renderTabs()}
        {this.renderContent()}
      </div>
    );
  }
}
