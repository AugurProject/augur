import React, { Component, useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import Styles from 'modules/common/selection.styles.less';
import { SimpleChevron } from './icons';

export interface NameValuePair {
  label: string;
  value: string | number;
}

export interface DropdownProps {
  id?: string;
  onChange: any;
  className?: string;
  defaultValue?: string | number;
  options: NameValuePair[];
  large?: boolean;
  staticLabel?: string;
  staticMenuLabel?: string;
  stretchOutOnMobile?: boolean;
  sortByStyles?: object;
  openTop?: boolean;
  stretchOut?: boolean;
  activeClassName?: string;
  showColor?: boolean;
  disabled?: boolean;
  sort?: boolean;
  preLabel?: string;
  preLabelClean?: boolean;
  dontCheckInvalid?: boolean;
}

interface DropdownState {
  selected: NameValuePair;
  showList: boolean;
  sortedList: NameValuePair[];
  scrollWidth?: number;
  clientWidth?: number;
  isDisabled?: boolean;
}

function findSelected(options, defaultVal) {
  const foundOption = options.find(
    o => o.value === defaultVal
  );
  const defaultValue = defaultVal ? {
    label: defaultVal.toString(),
    value: defaultVal,
  } : null;

  return foundOption ? foundOption : defaultValue;
}

class Dropdown extends Component<DropdownProps, DropdownState> {
  state: DropdownState = {
    selected: this.props.defaultValue !== null
        ? findSelected(this.props.options, this.props.defaultValue)
        : null,
    showList: false,
    scrollWidth: null,
    clientWidth: null,
    isDisabled: true,
    sortedList:
      this.props.sort && this.props.options
        ? this.props.options.sort((a, b) => (a.label > b.label ? 1 : -1))
        : this.props.options,
  };
  labelRef: any;

  componentDidMount() {
    this.measure();
//    window.addEventListener('click', this.handleWindowOnClick);
  }

  componentWillUnmount() {
//    window.removeEventListener('click', this.handleWindowOnClick);
  }

  componentDidUpdate(prevProps: DropdownProps, prevState: DropdownState) {
    this.measure();
    if (prevProps.defaultValue !== this.props.defaultValue) {
      this.setState({
        selected: findSelected(this.props.options, this.props.defaultValue)
      })
    }
    if (
      JSON.stringify(this.props.options) !==
        JSON.stringify(prevProps.options) ||
      this.props.sort !== prevProps.sort
    ) {
      const sortedList =
        this.props.sort && this.props.options
          ? this.props.options.sort((a, b) => (a.label > b.label ? 1 : -1))
          : this.props.options;
      this.setState({
        sortedList,
      });
    }
  }

  shouldComponentUpdate(nextProps: DropdownProps, nextState: DropdownState) {
    if (
      nextState.selected !== this.state.selected ||
      nextState.showList !== this.state.showList ||
      this.props.disabled !== nextProps.disabled ||
      this.props.staticLabel !== nextProps.staticLabel ||
      this.props.defaultValue !== nextProps.defaultValue ||
      JSON.stringify(this.props.options) !== JSON.stringify(nextProps.options) ||
      this.props.className !== nextProps.className
    ) {
      return true;
    }

    return (
      this.state.scrollWidth !== nextState.scrollWidth ||
      this.state.clientWidth !== nextState.clientWidth
    );
  }

  measure = () => {
    if (!this.labelRef) return;
    const { clientWidth, scrollWidth } = this.labelRef;

    this.setState({
      scrollWidth,
      clientWidth,
      isDisabled: !(scrollWidth > clientWidth),
    });
  };

  refDropdown: any = null;

  dropdownSelect = (selected: NameValuePair) => {
    const { onChange } = this.props;
    if (selected !== this.state.selected) {
      this.setState({
        selected,
      });

      if (onChange) {
        onChange(selected.value);
      }

      this.toggleList();
    }
  };

  toggleList = () => {
    this.setState({ showList: !this.state.showList });
  };

  handleWindowOnClick = (event: React.MouseEvent<HTMLElement>) => {
    if (this.refDropdown && !this.refDropdown.contains(event.target)) {
      this.setState({ showList: false });
    }
  };

  render() {
    const {
      sortByStyles,
      large,
      stretchOutOnMobile,
      openTop,
      className,
      activeClassName,
      staticLabel,
      id,
      showColor,
      disabled,
      preLabel,
      preLabelClean,
    } = this.props;
    const { selected, showList, isDisabled, sortedList } = this.state;
    return (
      <div
        style={sortByStyles}
        className={classNames(className, {
          [Styles.Large]: large,
          [Styles.Normal]: !large,
          [Styles.stretchOut]: stretchOutOnMobile,
          [Styles.isOpen]: showList,
          [Styles.openTop]: openTop,
          [`${activeClassName}`]: showList,
          [Styles.showColor]: showColor,
          [Styles.Disabled]: disabled,
        })}
        ref={dropdown => {
          this.refDropdown = dropdown;
        }}
        role="button"
        tabIndex={0}
        onClick={this.toggleList}
        data-tip
        data-for={'dropdown-' + id + staticLabel}
        data-iscapture={true}
      >
        {preLabel && <span>{`${preLabel}${preLabelClean ? '' : ':'}`}</span>}
        <button
          className={classNames(Styles.label, {
            [Styles.SelectedLabel]: selected,
          })}
        >
          <span ref={ref => (this.labelRef = ref)}>
            {selected ? selected.label : staticLabel}
          </span>
          {SimpleChevron}
        </button>
        <div>
          <div
            className={classNames(Styles.list, {
              [`${Styles.active}`]: showList,
            })}
          >
            {sortedList.map(option => (
              <button
                key={`${option.value}${option.label}`}
                value={option.value}
                onClick={() => this.dropdownSelect(option)}
                className={classNames({
                  [Styles.Selected]: option?.value === selected?.value,
                })}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        {selected && (
          <select
            onChange={e => {
              this.dropdownSelect(e.target.options[e.target.selectedIndex]);
            }}
            value={selected.value}
          >
            {sortedList.map(option => (
              <option
                key={`${option.value}${option.label}`}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>
        )}
      </div>
    );
  }
}

export const SquareDropdown = (props: DropdownProps) => <Dropdown {...props} />;

