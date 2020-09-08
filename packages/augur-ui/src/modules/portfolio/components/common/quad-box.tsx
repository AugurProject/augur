import React, { ReactNode, useState } from 'react';
import Styles from './quad-box.styles.less';
import classNames from 'classnames';
import { ToggleExtendButton } from 'modules/common/buttons';
import { SearchIcon, XIcon } from 'modules/common/icons';
import { SquareDropdown } from 'modules/common/selection';
import { NameValuePair } from 'modules/portfolio/types';
import SidebarNav, {
  OPTIONTYPE,
  TabsProps,
} from 'modules/portfolio/components/common/sidebar-nav';
import { useAppStatusStore } from 'modules/app/store/app-status';
import { THEMES } from 'modules/common/constants';

export interface QuadBoxProps {
  title?: string;
  headerComplement?: ReactNode;
  subheader?: ReactNode;
  content?: ReactNode;
  footer?: ReactNode;
  customClass?: string;
  search?: string;
  onSearchChange?: Function;
  setSearch?: Function;
  sortByOptions?: NameValuePair[];
  updateDropdown?: Function;
  tabs?: TabsProps[];
  setSelectedTab?: Function;
  toggle?: Function;
  hide?: boolean;
  extend?: boolean;
}

interface QuadBoxSearchProps {
  search?: string;
  setSearch?: Function;
  focus?: boolean;
  setFocus?: Function;
}
const QuadBoxSearch = ({ search, setSearch, focus, setFocus }: QuadBoxSearchProps) => {
  const closeSearchBar = () => {
    setFocus(!focus);
    setSearch('');
  };

  return setSearch ? (
    <div
      className={classNames(Styles.Search, {
        [Styles.ShowInput]: focus,
      })}
    >
      <input
        type="text"
        placeholder="Search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
      <span>{SearchIcon}</span>
      <button onClick={() => closeSearchBar()}>
        {focus ? XIcon : SearchIcon}
      </button>
    </div>
  ) : null;
};

interface QuadBoxSortProps {
  sortByOptions?: NameValuePair[];
  updateDropdown?: Function;
  focus: boolean;
}

const QuadBoxSort = ({ sortByOptions, updateDropdown, focus }: QuadBoxSortProps) => {
  return sortByOptions && updateDropdown ? (
    <SquareDropdown
      defaultValue={sortByOptions[0].value}
      options={sortByOptions}
      onChange={updateDropdown}
      className={classNames(Styles.Dropdown, {
        [Styles.Hide]: focus,
      })}
    />
  ) : null;
};

interface QuadBoxMobileFiltersProps {
  sortByOptions?: NameValuePair[];
  updateDropdown?: Function;
  tabs?: TabsProps[];
  setSelectedTab?: Function;
}

const QuadBoxMobileFilters = ({
  sortByOptions,
  updateDropdown,
  tabs,
  setSelectedTab,
}: QuadBoxMobileFiltersProps) => {
  const tabsFilters = setSelectedTab && tabs
    ? {
        type: OPTIONTYPE.RADIO,
        action: setSelectedTab,
        sectionTitle: 'Status',
        selected: tabs[0].value,
        options: tabs,
      }
    : null;

  const sortFilters = updateDropdown && sortByOptions
    ? {
        type: OPTIONTYPE.RADIO,
        action: updateDropdown,
        sectionTitle: 'Order By',
        selected: sortByOptions[0].value,
        options: sortByOptions,
      }
    : null;

  const filtersConfig = [tabsFilters, sortFilters].filter((filter) => !!filter);
  const showMobileFilters = filtersConfig.length > 0;

  return showMobileFilters ? (
    <SidebarNav headerTitle="Filters" filters={filtersConfig} />
  ) : null;
};

const QuadBox = ({
  title,
  headerComplement,
  subheader,
  footer,
  content,
  customClass,
  search,
  setSearch,
  sortByOptions,
  updateDropdown,
  tabs,
  setSelectedTab,
  toggle,
  hide,
  extend,
}: QuadBoxProps) => {
  const { theme } = useAppStatusStore();
  const isTrading = theme === THEMES.TRADING;
  const nothingInTheHeader =
    !title && !headerComplement && !setSearch && !updateDropdown;
  const [focus, setFocus] = useState(false);

  return (
    <div
      className={classNames(Styles.NewQuadBox, {
        [Styles.HideToggle]: hide,
        [Styles.ExtendToggle]: extend,
        [customClass]: customClass,
      })}
    >
      <div
        className={classNames(Styles.SearchAndFilters, {
          [Styles.Hide]: !setSearch && !updateDropdown && !setSelectedTab,
          [Styles.TwoColumns]: setSearch && (updateDropdown || setSelectedTab),
        })}
      >
        <QuadBoxSearch search={search} setSearch={setSearch} />
        <QuadBoxMobileFilters
          sortByOptions={sortByOptions}
          updateDropdown={updateDropdown}
          tabs={tabs}
          setSelectedTab={setSelectedTab}
        />
      </div>
      <div className={Styles.Container}>
        <div
          className={classNames(Styles.Header, {
            [Styles.Hide]: nothingInTheHeader,
          })}
        >
          <span>{title}</span>
          <div className={classNames({
            [Styles.HideToggleButton]: !toggle,
          })}>
            {headerComplement && headerComplement}
            {isTrading && <QuadBoxSort sortByOptions={sortByOptions} updateDropdown={updateDropdown} focus={focus} />}
            <QuadBoxSearch search={search} setSearch={setSearch} focus={focus} setFocus={setFocus} />
            <ToggleExtendButton toggle={toggle} />
          </div>
        </div>
        <div
          className={classNames(Styles.Subheader, {
            [Styles.Hide]: !subheader,
          })}
        >
          {subheader && subheader}
        </div>
        <div className={Styles.Content}>
          {content}
        </div>
        {footer && (
          <div className={Styles.Footer}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuadBox;
