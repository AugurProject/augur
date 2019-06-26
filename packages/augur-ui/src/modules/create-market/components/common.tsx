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

export interface LargeHeaderProps {
  text: string;
}

export const LargeHeader = (props: HeaderProps) => (
  <span className={Styles.LargeHeader}>{props.text}</span>
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

export interface SmallSubheadersProps {
  header: string;
  subheader: string;
}

export const SmallSubheaders = (props: SmallSubheadersProps) => (
  <div className={Styles.SmallSubheaders}>
    <span>{props.header}</span>
    <span>
      {props.subheader}
    </span>
  </div>        
);

export interface ExplainerBlockProps {
  title: string;
  subtexts: Array<string>;
}

export const ExplainerBlock = (props: ExplainerBlockProps) => (
  <div className={Styles.ExplainerBlock}>
    <h2>
      {props.title}
    </h2>
    {props.subtexts.map(subtext => 
      <p>
        {subtext}
      </p>
    )}
  </div>      
);

export interface ContentBlockProps {
  children: Array<any>;
}

export const ContentBlock = (props: ContentBlockProps) => (
  <div className={Styles.ContentBlock}>
    {props.children}
  </div>      
);

export const LineBreak = () => (
  <div className={Styles.LineBreak} />
);