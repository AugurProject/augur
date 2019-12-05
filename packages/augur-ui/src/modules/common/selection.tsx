import * as React from 'react';
import classNames from 'classnames';
import Styles from 'modules/common/selection.styles';
import {
  ThickChevron,
  Chevron,
  DotDotDot,
} from 'modules/common/icons';
import ReactTooltip from 'react-tooltip';
import TooltipStyles from 'modules/common/tooltip.styles.less';
import { MARKET_TEMPLATES } from 'modules/create-market/constants';

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
  highlight?: boolean;
  stretchOut?: boolean;
  activeClassName?: string;
  showColor?: boolean;
  disabled?: boolean;
  sort?: boolean;
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
}

interface PillSelectionProps {
  options: SelectionOption[];
  onChange(value: number): void;
  defaultSelection: number;
}

interface PillSelectionState {
  selected: number;
}

interface DotSelectionProps {
  children: JSX.Element[] | JSX.Element;
}

interface DotSelectionState {
  toggleMenu: boolean;
}

class Dropdown extends React.Component<DropdownProps, DropdownState> {
  state: DropdownState = {
    selected: this.props.defaultValue !== null
      ? this.props.options.find(o => o.value === this.props.defaultValue)
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
        selected: this.props.options.find(
          o => o.value === this.props.defaultValue
        ),
      });
    }
    if (
      JSON.stringify(this.props.options) !== JSON.stringify(prevProps.options)
    ) {
      const sortedList =
        prevProps.sort && prevProps.options
          ? this.props.options.sort((a, b) => (a.label > b.label ? 1 : -1))
          : prevProps.options;
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
      JSON.stringify(this.props.options) !== JSON.stringify(nextProps.options)
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
      >
        <button
          className={classNames(Styles.label, {
            [Styles.SelectedLabel]: selected,
          })}
        >
          <span ref={ref => (this.labelRef = ref)}>
            {selected ? selected.label : staticLabel}
          </span>
          {ThickChevron}
        </button>
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
            >
              {option.label}
            </button>
          ))}
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
            data-event="mouseover"
            data-event-off="blur scroll"
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
  }

  render() {
    const {
      sortByStyles,
      options,
      large,
      staticLabel,
      staticMenuLabel,
      highlight,
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

export class PillSelection extends React.Component<
  PillSelectionProps,
  PillSelectionState
> {
  state: PillSelectionState = {
    selected: this.props.defaultSelection || 0,
  };

  buttonSelect = (option: SelectionOption) => {
    const { onChange } = this.props;
    if (option.id !== this.state.selected) {
      this.setState({
        selected: option.id,
      });
      onChange(option.id);
    }
  };

  renderButton = (option: SelectionOption): React.ReactNode => (
    <li
      className={classNames({
        [Styles.Selected]: this.state.selected === option.id,
      })}
      key={option.label}
    >
      <button onClick={() => this.buttonSelect(option)}>{option.label}</button>
    </li>
  );

  render() {
    const { options } = this.props;
    return (
      <ul className={Styles.PillSelection}>
        {options.map(
          (option: SelectionOption): React.ReactNode =>
            this.renderButton(option)
        )}
      </ul>
    );
  }
}

export class DotSelection extends React.Component<
  DotSelectionProps,
  DotSelectionState
> {
  state: DotSelectionState = {
    toggleMenu: false,
  };

  componentDidMount() {
    document.addEventListener('mousedown', this.handleWindowOnClick);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleWindowOnClick);
  }

  refMenu: any = null;
  refMenuIcon: any = null;

  handleWindowOnClick = (event: React.MouseEvent<HTMLElement>) => {
    if (
      this.refMenu &&
      !this.refMenu.contains(event.target) &&
      !this.refMenuIcon.contains(event.target)
    ) {
      this.setState({ toggleMenu: false });
    }
  };

  toggleMenu() {
    this.setState({
      toggleMenu: !this.state.toggleMenu,
    });
  }

  render() {
    return (
      <div
        className={classNames(Styles.DotSelection, {
          [Styles.MenuOpen]: this.state.toggleMenu,
        })}
      >
        <button
          ref={menuIcon => {
            this.refMenuIcon = menuIcon;
          }}
          onClick={() => this.toggleMenu()}
        >
          {DotDotDot}
        </button>
        {this.state.toggleMenu && (
          <div
            role="Menu"
            ref={menu => {
              this.refMenu = menu;
            }}
            onClick={() => this.toggleMenu()}
            tabIndex={0}
            className={Styles.MenuItems}
          >
            {this.props.children}
          </div>
        )}
      </div>
    );
  }
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
