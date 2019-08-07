import * as React from "react";
import classNames from "classnames";
import Styles from "modules/common/selection.styles";
import { Chevron, DotDotDot, TwoArrows } from "modules/common/icons";
import ReactTooltip from "react-tooltip";
import TooltipStyles from "modules/common/tooltip.styles.less";

export interface NameValuePair {
  label: string;
  value: string | number;
}

export interface DropdownProps {
  id?: string;
  onChange: any;
  className?: string;
  defaultValue?: string | number;
  options: Array<NameValuePair>;
  large?: boolean;
  staticLabel?: string;
  stretchOutOnMobile?: boolean;
  sortByStyles?: object;
  openTop?: boolean;
  highlight?: boolean;
  stretchOut?: boolean;
  activeClassName?: string;
}

interface DropdownState {
  selected: NameValuePair;
  showList: boolean;
}

interface SelectionOption {
  label: string;
  id: number;
}

interface PillSelectionProps {
  options: Array<SelectionOption>;
  onChange(value: number): void;
  defaultSelection: number;
}

interface PillSelectionState {
  selected: number;
}

interface DotSelectionProps {
  children: React.StatelessComponent;
}

interface DotSelectionState {
  toggleMenu: boolean;
}

class Dropdown extends React.Component<DropdownProps, DropdownState> {
  state: DropdownState = {
    selected: this.props.defaultValue
      ? this.props.options.find(o => o.value === this.props.defaultValue)
      : null,
    showList: false,
    scrollWidth: null,
    clientWidth: null,
    isDisabled: true
  };

  componentDidMount() {
    this.measure();
    window.addEventListener("click", this.handleWindowOnClick);
  }

  componentWillUpdate(nextProps: DropdownProps) {
    if (nextProps.defaultValue !== this.props.defaultValue) {
      this.dropdownSelect(
        this.props.options.find(o => o.value === nextProps.defaultValue)
      );
    }
  }

  componentWillUnmount() {
    window.removeEventListener("click", this.handleWindowOnClick);
  }

  componentDidUpdate() {
    this.measure();
  }

  shouldComponentUpdate(nextProps: any, nextState: any) {
    if (nextState.selected !==  this.state.selected || nextState.showList !== this.state.showList) return true;

    return (
      this.state.scrollWidth !== nextState.scrollWidth ||
      this.state.clientWidth !== nextState.clientWidth
    );
  }

  measure = () => {
    const { clientWidth, scrollWidth } = this.labelRef;

    this.setState({
      scrollWidth,
      clientWidth,
      isDisabled: !(scrollWidth > clientWidth)
    });
  }

  refDropdown: any = null;

  dropdownSelect = (selected: NameValuePair) => {
    const { onChange } = this.props;
    if (selected !== this.state.selected) {
      this.setState({
        selected
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
      options,
      large,
      stretchOutOnMobile,
      openTop,
      className,
      activeClassName,
      staticLabel,
      id
    } = this.props;
    const { selected, showList, isDisabled } = this.state;

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
        })}
        ref={dropdown => {
          this.refDropdown = dropdown;
        }}
        role="button"
        tabIndex={0}
        onClick={this.toggleList}
        data-tip
        data-for={"dropdown-"+id+staticLabel}
      >
        <button 
          className={classNames(Styles.label, {
            [Styles.SelectedLabel]: selected
          })}
        >
          <span ref={ref => (this.labelRef = ref)}>{selected ? selected.label : staticLabel}</span>
          {large ? TwoArrows : Chevron}
        </button>
        <div
          className={classNames(Styles.list, {
            [`${Styles.active}`]: showList,
          })}
        >
          {options.map(option => (
            <button
              key={`${option.value}${option.label}`}
              value={option.value}
              onClick={() => this.dropdownSelect(option)}
            >
              {option.label}
            </button>
          ))}
        </div>
        {selected &&
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
        }
        {!isDisabled && (
          <ReactTooltip
            id={"dropdown-"+id+staticLabel}
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
    if (this.props.defaultValue) {
      this.setState({
        selected: this.props.options.find(o => o.value === this.props.defaultValue)
      });
    }
  }

  render() {
    const { sortByStyles, options, large, staticLabel, highlight, defaultValue } = this.props;
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
          [Styles.highlight]: highlight,
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
          <b>{selected.label}</b> {large ? TwoArrows : Chevron}
        </button>
        <div
          className={classNames({
            [`${Styles.active}`]: showList
          })}
        >
          {options.map(option => (
            <button
              key={`${option.value}${option.label}`}
              value={option.value}
              onClick={() => this.dropdownSelect(option)}
            >
              {staticLabel}
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
    selected: this.props.defaultSelection || 0
  };

  buttonSelect = (option: SelectionOption) => {
    const { onChange } = this.props;
    if (option.id !== this.state.selected) {
      this.setState({
        selected: option.id
      });
      onChange(option.id);
    }
  };

  renderButton = (option: SelectionOption): React.ReactNode => (
    <li
      className={classNames({
        [Styles.Selected]: this.state.selected === option.id
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
    toggleMenu: false
  };

  componentDidMount() {
    document.addEventListener("mousedown", this.handleWindowOnClick);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleWindowOnClick);
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
      toggleMenu: !this.state.toggleMenu
    });
  }

  render() {
    return (
      <div
        className={classNames(Styles.DotSelection, {
          [Styles.MenuOpen]: this.state.toggleMenu
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
