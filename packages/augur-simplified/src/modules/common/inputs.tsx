import React, { useRef } from 'react';
import { XIcon } from './icons';
import Styles from './inputs.styles.less';

const ENTER_CHAR_CODE = 13;
export const SearchInput = ({ value, onChange, clearValue }) => {
  const input = useRef();
  const keypressHandler = e => {
    if (e.charCode === ENTER_CHAR_CODE) {
      input.current && input.current.blur();
    }
  };

  return (
  <div className={Styles.SearchInput}>
    <input
      ref={input}
      placeholder="Search for a market"
      value={value}
      onChange={onChange}
      onKeyPress={event => keypressHandler(event)}
    />
    <div onClick={clearValue}>{XIcon}</div>
  </div>
);
}
