import React, { Component, useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import Styles from 'modules/common/selection.styles.less';
import { ThickChevron, Chevron, ShareIcon, SlimArrow, AlternateCheckMark } from 'modules/common/icons';
import ReactTooltip from 'react-tooltip';
import TooltipStyles from 'modules/common/tooltip.styles.less';
import { MARKET_TEMPLATES } from 'modules/create-market/constants';
import { INVALID_OUTCOME_ID } from 'modules/common/constants';

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
  minimalStyle?: boolean
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

interface SelectionOption {
  label: string;
  id: number;
  subLabel?: string;
  isDisabled?: boolean;
}

interface PillSelectionProps {
  options: SelectionOption[];
  onChange(value: number): void;
  defaultSelection: number;
  large?: boolean;
  hide?: boolean;
}

interface PillSelectionState {
  selected: number;
}

interface TabProps {
  options: SelectionOption[];
  onChange(value: number): void;
  defaultSelection: number;
  large?: boolean;
  small?: boolean;
}

interface TabState {
  selected: number;
}

interface DotSelectionProps {
  children: JSX.Element[] | JSX.Element;
}

interface DotSelectionState {
  toggleMenu: boolean;
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
    window.addEventListener('click', this.handleWindowOnClick);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.handleWindowOnClick);
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
      minimalStyle,
      preLabel,
      dontCheckInvalid,
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
          [Styles.Minimal]: minimalStyle,
          [`${Styles[`showColor-${selected ? selected.value + 1 : 1}`]}`]:
            selected && showColor,
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
            [Styles.invalidColor]: !dontCheckInvalid && selected?.value === INVALID_OUTCOME_ID,
          })}
        >
          <span ref={ref => (this.labelRef = ref)}>
            {selected ? selected.label : staticLabel}
          </span>
          {minimalStyle ? SlimArrow : ThickChevron}
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
                  [Styles.invalidColor]: !dontCheckInvalid && option?.value === INVALID_OUTCOME_ID,
                })}
              >
                {option.label}
                {minimalStyle && option?.value === selected?.value && AlternateCheckMark}
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
        {!isDisabled && (
          <ReactTooltip
            id={'dropdown-' + id + staticLabel}
            className={TooltipStyles.Tooltip}
            effect="solid"
            place="top"
            type="light"
            event="mouseover mouseenter"
            eventOff="mouseleave mouseout scroll mousewheel blur"
          >
            {selected.label}
          </ReactTooltip>
        )}
      </div>
    );
  }
}

export const SquareDropdown = (props: DropdownProps) => <Dropdown {...props} />;

export class StaticLabelDropdown extends Dropdown {
  componentDidMount() {
    const { options, defaultValue } = this.props;
    if (defaultValue) {
      this.setState({
        selected: options.find(o => o.value === defaultValue),
      });
    }
    window.addEventListener('click', this.handleWindowOnClick);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.handleWindowOnClick);
  }


  handleWindowOnClick = (event: React.MouseEvent<HTMLElement>) => {
    if (this.refDropdown && !this.refDropdown.contains(event.target)) {
      this.setState({ showList: false });
    }
  };

  render() {
    const {
      sortByStyles,
      options,
      large,
      staticLabel,
      staticMenuLabel,
    } = this.props;
    const { selected, showList } = this.state;
    if (!selected) {
      return null;
    }

    return (
      <div
        style={sortByStyles}
        className={classNames({
          [Styles.Large]: large,
          [Styles.Normal]: !large,
          [Styles.isOpen]: showList,
        })}
        ref={dropdown => {
          this.refDropdown = dropdown;
        }}
        role="button"
        tabIndex={0}
        onClick={this.toggleList}
      >
        <button>
          {staticLabel}
          &nbsp;
          <b>{selected.label}</b> {Chevron}
        </button>
        <div>
          <div
            className={classNames({
              [`${Styles.active}`]: showList,
            })}
          >
            {options.map(option => (
              <button
                key={`${option.value}${option.label}`}
                value={option.value}
                onClick={() => this.dropdownSelect(option)}
              >
                {staticMenuLabel}
                &nbsp;
                <b>{option.label}</b>
              </button>
            ))}
          </div>
        </div>
        <select
          onChange={e => {
            this.dropdownSelect(e.target.options[e.target.selectedIndex]);
          }}
          value={selected.value}
        >
          {options.map(option => (
            <option key={`${option.value}${option.label}`} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }
}

export const PillSelection = ({
  options,
  onChange,
  defaultSelection = 0,
  large,
  hide = false
}: PillSelectionProps) => {
  const [selected, setSelected] = useState(defaultSelection);

  useEffect(() => {
    setSelected(defaultSelection);
  }, [defaultSelection]);

  const buttonSelect = (option: SelectionOption) => {
    if (option.id !== selected) {
      setSelected(option.id);
      onChange(option.id);
    }
  };

  const renderButton = (option: SelectionOption): React.ReactNode => (
    <li
      className={classNames({
        [Styles.Selected]: selected === option.id
      })}
      key={option.label}
    >
      <button onClick={() => buttonSelect(option)} disabled={option.isDisabled}>
        {option.label} {option.subLabel && <span>{option.subLabel}</span>}
      </button>
    </li>
  );

  return (
    <ul className={classNames(Styles.PillSelection, {
      [Styles.LargePillSelection]: large,
      [Styles.hide]: hide
    })}>
      {options.map(
        (option: SelectionOption): React.ReactNode => renderButton(option)
      )}
    </ul>
  );
};

export const Tab = ({
  options,
  onChange,
  defaultSelection = 0,
  large,
  small
}: TabProps) => {
  const [selected, setSelected] = useState(defaultSelection);
  const buttonSelect = (option: SelectionOption) => {
    if (option.id !== selected) {
      setSelected(option.id);
      onChange(option.id);
    }
  };

  const renderButton = (option: SelectionOption): React.ReactNode => (
    <li
      className={classNames({
        [Styles.Selected]: selected === option.id
      })}
      key={option.label}
    >
      <button onClick={() => buttonSelect(option)}>
        {option.label}
      </button>
    </li>
  );

  return (
    <ul
      className={classNames(Styles.Tab, {
        [Styles.TabLarge]: large,
        [Styles.TabSmall]: small,
      })}>
      {options.map(
        (option: SelectionOption): React.ReactNode =>
          renderButton(option)
      )}
    </ul>
  );
}

export const DotSelection = ({ children, customClass = null }) => {
  const [toggleMenu, setToggleMenu] = useState(false);
  const menuIcon = useRef(null);
  const menu = useRef(null);
  useEffect(() => {
    function handleWindowOnClick (event: React.MouseEvent<HTMLElement>) {
      if (
        !menu?.current?.contains(event.target) &&
        !menuIcon?.current?.contains(event.target)
      ) {
        setToggleMenu(false);
      }
    };

    document.addEventListener('mousedown', handleWindowOnClick);

    return () => document.removeEventListener('mousedown', handleWindowOnClick);
  }, []);

  return (
    <div
      className={classNames(Styles.DotSelection, {
        [Styles.MenuOpen]: toggleMenu,
        [customClass]: !!customClass,
      })}
    >
      <button
        ref={menuIcon}
        onClick={() => setToggleMenu(!toggleMenu)}
      >
        {ShareIcon}
      </button>
      {toggleMenu && (
        <div
          role="Menu"
          ref={menu}
          onClick={() => setToggleMenu(!toggleMenu)}
          tabIndex={0}
          className={Styles.MenuItems}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export interface CategorySelectorProps {
  action: Function;
  selected: string;
}

export const CategorySelector = ({
  action,
  selected,
}: CategorySelectorProps) => {
  const options = [{ value: 'all', header: 'All' }].concat(MARKET_TEMPLATES);
  return (
    <div className={Styles.CategorySelector}>
      {options.map((item, idx) => {
        const option = item.value.toLowerCase();
        return (
          <div
            key={idx}
            onClick={() => action(option)}
            className={selected === option ? Styles.selected : null}
          >
            {item.header}
          </div>
        );
      })}
    </div>
  );
};
