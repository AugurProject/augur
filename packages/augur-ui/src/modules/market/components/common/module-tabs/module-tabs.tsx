import React, { Component } from 'react';
import classNames from 'classnames';

import ModulePane from 'modules/market/components/common/module-tabs/module-pane';
import Styles from 'modules/market/components/common/module-tabs/module-tabs.style.less';
import { ToggleExtendButton } from 'modules/common/buttons';
import { HEADER_TYPE, ZEROX_STATUSES_TOOLTIP } from 'modules/common/constants';
import { StatusDotTooltip } from 'modules/common/labels';

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
  status?: string;
}

interface ModuleTabsState {
  selected?: number;
}

export default class ModuleTabs extends Component<
  ModuleTabsProps,
  ModuleTabsState
> {
  state = {
    selected: this.props.selected,
  };
  prevOffset: number = 0;

  componentDidUpdate(prevProps) {
    if (this.props.selected !== prevProps.selected) {
      this.setState({ selected: this.props.selected });
    }
  }

  handleClick(e, index, onClickCallback) {
    if (e) e.preventDefault();
    this.setState({
      selected: index,
    });
    if (onClickCallback) onClickCallback();
  }

  renderTabs() {
    const { selected } = this.state;
    const {
      noBorder,
      fillWidth,
      leftButton,
      fillForMobile,
      children,
      showToggle,
      toggle,
    } = this.props;

    function labels(child, index) {
      const { onClickCallback, headerType, label, isNew, status } =
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
          <>
            {status && (
              <StatusDotTooltip
                status={status}
                tooltip={ZEROX_STATUSES_TOOLTIP[status]}
                title={''}
              />
            )}
            <button onClick={e => this.handleClick(e, index, onClickCallback)}>
              {headerType === HEADER_TYPE.H1 ? (
                <h1 className={classNames(classNameObject)}>{label || ''}</h1>
              ) : (
                <span className={classNames(classNameObject)}>
                  {label || ''}
                </span>
              )}
            </button>
          </>
        </li>
      );
    }

    return (
      <div
        className={classNames(Styles.Headers)}>
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
