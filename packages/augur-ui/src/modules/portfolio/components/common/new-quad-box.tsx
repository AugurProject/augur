import React, { ReactNode, useState } from 'react';
import Styles from './new-quad-box.styles.less'
import classNames from 'classnames';
import { ToggleExtendButton } from 'modules/common/buttons';
import { SearchIcon, XIcon } from 'modules/common/icons';
import { SquareDropdown } from 'modules/common/selection';
import { NameValuePair } from 'modules/portfolio/types';

export interface NewQuadBoxProps {
  title?: string;
  headerComplement?: ReactNode;
  subheader?: ReactNode;
  content?: ReactNode;
  footer?: ReactNode;
  filters?: ReactNode;
  customClass?: string;
  search?: string;
  onSearchChange?: Function;
  setSearch?: Function;
  sortByOptions?: NameValuePair[];
  updateDropdown?: Function;
}

const QuadBoxSearch = ({search, setSearch}) => {
  const [focus, setFocus] = useState(false);

  return setSearch ? (
    <div className={classNames(Styles.SearchMock, {
      [Styles.ShowInput]: focus,
    })}>
      <input type="text" placeholder="Search" value={search} onChange={event => setSearch(event.target.value)} />
      <span>{SearchIcon}</span>
      <button onClick={() => setFocus(!focus)}>{focus ? XIcon : SearchIcon}</button>
    </div>
  ) : null;
};

const QuadBoxSort = ({
  sortByOptions,
  updateDropdown,
}) => {
  return (sortByOptions && updateDropdown) ? (
    <SquareDropdown
      defaultValue={sortByOptions[0].value}
      options={sortByOptions}
      onChange={updateDropdown}
    />
  ) : null;
};

const NewQuadBox = ({
  title,
  headerComplement,
  subheader,
  content,
  filters,
  customClass,
  search,
  setSearch,
  sortByOptions,
  updateDropdown,
}: NewQuadBoxProps) => {
  const [extend, setExtend] = useState(false);
  const nothingInTheHeader = !title && !headerComplement && !setSearch && !updateDropdown;

  return (
    <div className={classNames(Styles.NewQuadBox, {
      [customClass]: customClass
    })}>
      <div className={classNames(Styles.SearchAndFilters, {
        [Styles.Hide]: !setSearch && !filters,
      })}>
        <QuadBoxSearch
          search={search}
          setSearch={setSearch}
        />
        <QuadBoxSort
          options={sortByOptions}
          onChange={updateDropdown}
        />
        {filters && filters}
      </div>
      <div className={classNames(Styles.Container, {
        [Styles.Extend]: extend,
      })}>
        <div className={classNames({
          [Styles.Hide]: nothingInTheHeader,
        })}>
          <span>{title}</span>
          <div>
            {headerComplement && headerComplement}
            <QuadBoxSearch
              search={search}
              setSearch={setSearch}
            />
            <QuadBoxSort
              options={sortByOptions}
              onChange={updateDropdown}
            />
            <ToggleExtendButton toggle={setExtend} />
          </div>
        </div>
        <div className={classNames(Styles.SubHeader, {
          [Styles.Hide]: !subheader,
        })}>
          {subheader && subheader}
        </div>
        <div className={Styles.Content}>
          {content}
        </div>
      </div>
    </div>
  );
};

export default NewQuadBox;
