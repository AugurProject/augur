import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import Styles from './selection.styles.less';
import {
  CheckedRadioButton,
  EmptyCheckbox,
  EthIcon,
  FilledCheckbox,
  RadioButton,
  SimpleChevron,
  UsdIcon,
} from './icons';
import { USDC, ETH } from '../../utils/constants';
import { TinyButton } from './buttons';

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

function findSelected(options, defaultVal) {
  const foundOption = options.find(o => o.value === defaultVal);
  const defaultValue = defaultVal
    ? {
        label: defaultVal.toString(),
        value: defaultVal,
      }
    : null;

  return foundOption ? foundOption : defaultValue;
}

export const Dropdown = ({
  options,
  defaultValue,
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
  onChange,
}: DropdownProps) => {
  const labelRef = useRef(null);
  const refDropdown = useRef(null);
  const [selected, setSelected] = useState(
    defaultValue !== null ? findSelected(options, defaultValue) : null
  );

  useEffect(() => {
    setSelected(
      defaultValue !== null ? findSelected(options, defaultValue) : null
    );
  }, [defaultValue]);

  const handleWindowOnClick = (event: MouseEvent) => {
    if (refDropdown?.current && !refDropdown?.current.contains(event.target)) {
      setShowList(false);
    }
  }

  useEffect(() => {
    window.addEventListener('click', handleWindowOnClick);
    return () => {
      window.removeEventListener('click', handleWindowOnClick);
    };
  }, []);

  const [showList, setShowList] = useState(false);
  const dropdownSelect = (selectedVal: NameValuePair) => {
    if (selectedVal !== selected) {
      setSelected(selectedVal);

      if (onChange) {
        onChange(selectedVal.value);
      }

      toggleList();
    }
  };

  const toggleList = () => {
    setShowList(!showList);
  };

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
      ref={refDropdown}
      role="button"
      tabIndex={0}
      onClick={toggleList}
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
        <span ref={labelRef}>
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
          {options.map(option => (
            <button
              key={`${option.value}${option.label}`}
              value={option.value}
              onClick={() => dropdownSelect(option)}
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
            dropdownSelect(e.target.options[e.target.selectedIndex]);
          }}
          value={selected.value}
        >
          {options.map(option => (
            <option key={`${option.value}${option.label}`} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export const SquareDropdown = (props: DropdownProps) => <Dropdown {...props} />;

export const SmallDropdown = (props: DropdownProps) => (
  <Dropdown {...props} className={Styles.SmallDropdown} />
);

const currencyValues = [
  { label: USDC, value: USDC, icon: UsdIcon },
  { label: ETH, value: ETH, icon: EthIcon },
];

export const CurrencyDropdown = (props: DropdownProps) => (
  <Dropdown
    {...props}
    options={currencyValues}
    className={Styles.CurrencyDropdown}
  />
);

const Checkbox = ({ item, initialSelected, updateSelected }) => {
  const [selected, setSelected] = useState(initialSelected);
  return (
    <div
      onClick={e => {
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
            updateSelected={selected => updateSelected(selected, index)}
          />
        ))}
      </div>
    </div>
  );
};

const RadioBar = ({ item, selected, onClick }) => {
  return (
    <div
      onClick={e => {
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
        {items.map(item => (
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

export const MultiButtonSelection = ({ options, selection, setSelection }) => (
  <ul className={Styles.MultiButtonSelection}>
    {options.map(({ id, label }) => (
      <li key={`option-${id}`}>
        <TinyButton
          text={label}
          selected={selection === id}
          action={() => selection !== id && setSelection(id)}
        />
      </li>
    ))}
  </ul>
);
