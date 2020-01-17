import React, { Component } from "react";
import classNames from "classnames";

import ModulePane from "modules/market/components/common/module-tabs/module-pane";
import Styles from "modules/market/components/common/module-tabs/module-tabs.style";
import { ToggleExtendButton } from "modules/common/buttons";

interface ModuleTabsProps {
  className?: string;
  selected?: number;
  children: ModulePane[];
  fillWidth?: boolean;
  fillForMobile?: boolean;
  noBorder?: boolean;
  id?: string;
  leftButton: React.ReactNode;
  scrollOver?: boolean;
  showToggle?: boolean;
  toggle?: Function;
}

export default class ModuleTabs extends Component<ModuleTabsProps> {
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
      selected: props.selected,
      scrolling: false
    };

    this.prevOffset = 0;
    this.handleClick = this.handleClick.bind(this);
    this.renderTabs = this.renderTabs.bind(this);
    this.renderContent = this.renderContent.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.selected !== prevProps.selected) {
      this.setState({selected: this.props.selected});
    }
  }

  componentDidMount() {
    // only apply on scrollOver:
    if (this.props.scrollOver) {
      window.onscroll = () => {
        // sometimes offset is 1 on mount
        const currOffset = (window.pageYOffset - 1);
        const scrolling = false;
        if (this.prevOffset < currOffset) {
          scrolling = true;
        } else {
          scrolling = false;
        }
        this.prevOffset = currOffset;
        if (scrolling != this.state.scrolling) this.setState({ scrolling });
      };
    }
  }

  componentWillUnmount() {
    window.onscroll = null;
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
      <div className={classNames(Styles.Headers, { [Styles.scrolling]: this.props.scrollOver && this.state.scrolling })}>
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
