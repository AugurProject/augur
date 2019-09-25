import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import ModulePane from "modules/market/components/common/module-tabs/module-pane";
import Styles from "modules/market/components/common/module-tabs/module-tabs.style";
import { ToggleExtendButton } from "modules/common/buttons";

export default class ModuleTabs extends Component {
  static propTypes = {
    className: PropTypes.string,
    selected: PropTypes.number,
    children: PropTypes.arrayOf(ModulePane).isRequired,
    fillWidth: PropTypes.bool,
    fillForMobile: PropTypes.bool,
    noBorder: PropTypes.bool,
    id: PropTypes.string,
    leftButton: PropTypes.element,
    scrollOver: PropTypes.bool,
    showToggle: PropTypes.bool,
    toggle: PropTypes.func,
  };

  static defaultProps = {
    selected: 0,
    className: "",
    fillWidth: false,
    fillForMobile: false,
    id: "id",
    noBorder: false,
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

  handleClick(e, index, onClickCallback) {
    if (e) e.preventDefault();
    this.setState({
      selected: index
    });
    if (onClickCallback) onClickCallback();
  }

  renderTabs() {
    function labels(child, index) {
      return (
        <li
          key={index}
          className={classNames({
            [Styles.ActiveTab]: this.state.selected === index,
            [Styles.ActiveTabFill]:
              this.state.selected === index && this.props.fillWidth
          })}
        >
          <button
            onClick={e => {
              this.handleClick(e, index, child.props.onClickCallback);
            }}
          >
            <span
              className={classNames({
                [Styles.ActiveSpanFill]:
                  this.state.selected === index && this.props.fillWidth,
                [Styles.ActiveNoBorder]:
                  this.state.selected === index && this.props.noBorder,
                [Styles.IsNew]: child.props && child.props.isNew,
              })}
            >
              {child.props && child.props.label || ""}
            </span>
          </button>
        </li>
      );
    }

    return (
      <div className={Styles.Headers}>
        {this.props.leftButton}
        <ul
          className={classNames({
            [Styles.Fill]: this.props.fillWidth,
            [Styles.FillWidth]:
              this.props.fillWidth || this.props.fillForMobile,
            [Styles.NoBorder]: this.props.noBorder
          })}
        >
          {this.props.children.map(labels.bind(this))}
        </ul>
        {this.props.showToggle && this.props.toggle &&
          <ToggleExtendButton toggle={this.props.toggle} />
        }
      </div>
    );
  }

  renderContent() {
    return (
      <div className={Styles.Content}>
        {this.props.children[this.state.selected]}
      </div>
    );
  }

  render() {
    return (
      <div
        className={classNames(Styles.ModuleTabs, this.props.className, {
          [Styles.ScrollOver]: this.props.scrollOver
        })}
        id={"tabs_" + this.props.id}
      >
        {this.renderTabs()}
        {this.renderContent()}
      </div>
    );
  }
}
