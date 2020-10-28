import React, { useState, useRef, useEffect } from 'react';
import classNames from 'classnames';
import Styles from 'modules/common/search.styles.less';
import { SearchIcon, XIcon, SmallXIcon } from 'modules/common/icons';
import { THEMES } from 'modules/common/constants';
import { useAppStatusStore } from 'modules/app/store/app-status';

export interface SearchBarProps {
  onChange: (value: string) => void;
  placeholder?: string;
  onFocus: Function;
}

export const SearchBar = ({
  onChange,
  placeholder = 'Search',
  onFocus,
}: SearchBarProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const container = useRef();
  const search = useRef();
  const { theme } = useAppStatusStore();

  useEffect(() => {
    function handleClick(event) {
      if (container?.current?.contains(event.target) && search?.current) {
        search.current.focus();
      }
    }
    window.addEventListener('click', handleClick);

    return () => window.removeEventListener('click', handleClick);
  }, [])

  return (
    <div
      className={classNames(Styles.Container, {
        [Styles.ContainerFocused]: isFocused,
      })}
    >
      <div
        className={classNames(Styles.SearchBar, {
          [Styles.isFocused]: isFocused,
        })}
        ref={container}
        onClick={() => {
          setIsFocused(true);
          onFocus(false);
        }}
      >
        <input
          ref={search}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
        />
        <div>Search</div>
        {isFocused ? (
          <button onClick={(e) => {
            setIsFocused(false);
            onFocus(true);
            search?.current?.value = '';
            onChange('');
            e.stopPropagation();
          }}>
            {theme === THEMES.SPORTS ? SmallXIcon : XIcon}
          </button>
        ) : (
          SearchIcon
        )}
      </div>
    </div>
  );
};
