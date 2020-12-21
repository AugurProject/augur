import React, { Component, useEffect, useState } from 'react';
import classNames from 'classnames';
import Styles from 'modules/common/selection.styles.less';
import {
  CheckedRadioButton,
  EmptyCheckbox,
  FilledCheckbox,
  RadioButton,
  SimpleChevron,
  UsdIcon,
} from './icons';
import { USDC } from 'modules/constants';

export interface NameValuePair {
  label: string;
  value: string | number;
  icon?: any;
}

export interface DropdownProps {
  id?: string;
  onChange: any;
  className?: string;
  defaultValue?: string | number;
  options?: NameValuePair[];
  large?: boolean;
  staticLabel?: string;
  staticMenuLabel?: string;
  sortByStyles?: object;
  openTop?: boolean;
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
  const foundOption = options.find((o) => o.value === defaultVal);
  const defaultValue = defaultVal
    ? {
        label: defaultVal.toString(),
        value: defaultVal,
      }
    : null;

  return foundOption ? foundOption : defaultValue;
}

class Dropdown extends Component<DropdownProps, DropdownState> {
  state: DropdownState = {
    selected:
      this.props.defaultValue !== null
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
        selected: findSelected(this.props.options, this.props.defaultValue),
      });
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
      JSON.stringify(this.props.options) !==
        JSON.stringify(nextProps.options) ||
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
    const { selected, showList, sortedList } = this.state;
    return (
      <div
        style={sortByStyles}
        className={classNames(className, {
          [Styles.Large]: large,
          [Styles.Normal]: !large,
          [Styles.isOpen]: showList,
          [Styles.openTop]: openTop,
          [`${activeClassName}`]: showList,
          [Styles.showColor]: showColor,
          [Styles.Disabled]: disabled,
        })}
        ref={(dropdown) => {
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
          <span ref={(ref) => (this.labelRef = ref)}>
            {selected?.icon ? selected.icon : null}
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
            {sortedList.map((option) => (
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
            onChange={(e) => {
              this.dropdownSelect(e.target.options[e.target.selectedIndex]);
            }}
            value={selected.value}
          >
            {sortedList.map((option) => (
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

export const SmallDropdown = (props: DropdownProps) => (
  <Dropdown {...props} className={Styles.SmallDropdown} />
);

const currencyValues = [{ label: USDC, value: USDC, icon: UsdIcon }];

export const CurrencyDropdown = (props: DropdownProps) => (
  <Dropdown
    {...props}
    defaultValue={currencyValues[0].label}
    options={currencyValues}
    className={Styles.CurrencyDropdown}
  />
);

const Checkbox = ({ item, initialSelected, updateSelected }) => {
  const [selected, setSelected] = useState(initialSelected);
  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        setSelected(!selected);
        updateSelected(!selected);
      }}
      className={classNames(Styles.Checkbox, { [Styles.Selected]: selected })}
    >
      {selected ? FilledCheckbox : EmptyCheckbox}

      <span>{item.label}</span>
    </div>
  );
};

export const CheckboxGroup = ({ title, items }) => {
  const [selectedItems, setSelectedItems] = useState(items);

  const updateSelected = (selected, index) => {
    let updatedItems = selectedItems;
    updatedItems[index].selected = !updatedItems[index].selected;
    setSelectedItems(updatedItems);
  };
  return (
    <div className={Styles.SelectionGroup}>
      <span>{title}</span>
      <div>
        {selectedItems.map((item, index) => (
          <Checkbox
            item={item}
            key={item.value}
            initialSelected={selectedItems[index].selected}
            updateSelected={(selected) => updateSelected(selected, index)}
          />
        ))}
      </div>
    </div>
  );
};

const RadioBar = ({ item, selected, onClick }) => {
  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
      className={classNames(Styles.RadioBar, { [Styles.Selected]: selected })}
    >
      {selected ? CheckedRadioButton : RadioButton}
      <span>{item.label}</span>
    </div>
  );
};

export const RadioBarGroup = ({ title, items, selected, update }) => {
  const [selectedItem, setSelectedItem] = useState(selected);
  useEffect(() => {
    setSelectedItem(selected);
  }, [selected]);
  return (
    <div className={Styles.SelectionGroup}>
      <span>{title}</span>
      <div>
        {items.map((item) => (
          <RadioBar
            item={item}
            key={item.value}
            selected={selectedItem === item.value}
            onClick={() => {
              update(item.value);
              setSelectedItem(item.value);
            }}
          />
        ))}
      </div>
    </div>
  );
};
