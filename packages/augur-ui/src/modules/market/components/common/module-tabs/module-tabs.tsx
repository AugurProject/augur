import React, { Component } from 'react';
import classNames from 'classnames';

import ModulePane from 'modules/market/components/common/module-tabs/module-pane';
import Styles from 'modules/market/components/common/module-tabs/module-tabs.style.less';
import { ToggleExtendButton } from 'modules/common/buttons';
import { HEADER_TYPE } from 'modules/common/constants';

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

interface ModuleTabsState {
  selected?: number;
  scrolling: boolean;
}

export default class ModuleTabs extends Component<
  ModuleTabsProps,
  ModuleTabsState
> {
  state = {
    selected: this.props.selected,
    scrolling: false,
  };
  prevOffset: number = 0;

  componentDidUpdate(prevProps) {
    if (this.props.selected !== prevProps.selected) {
      this.setState({ selected: this.props.selected });
    }
  }

  componentDidMount() {
    // only apply on scrollOver:
    if (this.props.scrollOver) {
      window.onscroll = () => {
        // sometimes offset is 1 on mount
        const currOffset = window.pageYOffset - 1;
        let isScrolling = this.prevOffset < currOffset;
        this.prevOffset = currOffset;
        if (isScrolling !== this.state.scrolling)
          this.setState({ scrolling: isScrolling });
      };
    }
  }

  componentWillUnmount() {
    window.onscroll = null;
  }

  handleClick(e, index, onClickCallback) {
    if (e) e.preventDefault();
    this.setState({
      selected: index,
    });
    if (onClickCallback) onClickCallback();
  }

  renderTabs() {
    const { selected, scrolling } = this.state;
    const {
      noBorder,
      fillWidth,
      scrollOver,
      leftButton,
      fillForMobile,
      children,
      showToggle,
      toggle,
    } = this.props;

    function labels(child, index) {
      const { onClickCallback, headerType, label, isNew } =
        child && child.props;

      const classNameObject = {
        [Styles.ActiveSpanFill]: selected === index && fillWidth,
        [Styles.ActiveNoBorder]: selected === index && noBorder,
        [Styles.IsNew]: isNew,
      };

      return (
        <li
          key={index}
          className={classNames({
            [Styles.ActiveTab]: selected === index,
            [Styles.ActiveTabFill]: selected === index && fillWidth,
          })}
        >
          <button onClick={e => this.handleClick(e, index, onClickCallback)}>
            {headerType === HEADER_TYPE.H1 ? (
              <h1 className={classNames(classNameObject)}>{label || ''}</h1>
            ) : (
              <span className={classNames(classNameObject)}>{label || ''}</span>
            )}
          </button>
        </li>
      );
    }

    return (
      <div
        className={classNames(Styles.Headers, {
          [Styles.scrolling]: scrollOver && scrolling,
        })}
      >
        {leftButton}
        <ul
          className={classNames({
            [Styles.Fill]: fillWidth,
            [Styles.FillWidth]: fillWidth || fillForMobile,
            [Styles.NoBorder]: noBorder,
          })}
        >
          {children.map(labels.bind(this))}
        </ul>
        {showToggle && toggle && <ToggleExtendButton toggle={toggle} />}
      </div>
    );
  }

  renderContent() {
    const { selected } = this.state;
    const { children } = this.props;

    return <div className={Styles.Content}>{children[selected]}</div>;
  }

  render() {
    const { className, scrollOver, id } = this.props;

    return (
      <div
        className={classNames(Styles.ModuleTabs, className, {
          [Styles.ScrollOver]: scrollOver,
        })}
        id={'tabs_' + id}
      >
        {this.renderTabs()}
        {this.renderContent()}
      </div>
    );
  }
}
