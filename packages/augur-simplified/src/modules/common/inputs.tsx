import React from 'react';
import { XIcon } from './icons';
import Styles from './inputs.styles.less';

export const SearchInput = ({ value, onChange, clearValue }) => (
  <div className={Styles.SearchInput}>
    <input
      placeholder="Search for a market"
      value={value}
      onChange={onChange}
    />
    <div onClick={clearValue}>{XIcon}</div>
  </div>
);
