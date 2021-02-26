import React from 'react';
import Styles from './index.less';

export const Loader = ({
  darkMode,
  size = '16px',
  stroke,
}: {
  darkMode: boolean;
  size?: string;
  stroke?: string;
  [k: string]: any;
}) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke={stroke}
      // {...rest}
      className={Styles.animate}
      style={{
        height: size,
        width: size,
        margin: '0 1rem',
      }}
    >
      <path
        d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 9.27455 20.9097 6.80375 19.1414 5"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke={darkMode ? '#2172E5' : '#2172E5'}
      />
    </svg>
  );
};