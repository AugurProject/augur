import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import Styles from "modules/create-market/components/common.styles";

export interface HeaderProps {
  text: string;
}

export const Header = (props: HeaderProps) => (
  <span className={Styles.Header}>{props.text}</span>
);

export interface SubheadersProps {
  header: string;
  subheader: string;
  link?: Boolean;
}

export const Subheaders = (props: SubheadersProps) => (
  <div className={Styles.Subheaders}>
    <span>{props.header}</span>
    <span>
      {props.subheader}
      {props.link && <a target="blank" href="https://docs.augur.net">Learn more</a>}
    </span>
  </div>        
);