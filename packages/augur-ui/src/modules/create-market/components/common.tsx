import React, { Component } from 'react';
import classNames from 'classnames';

import { SecondaryButton } from 'modules/common/buttons';
import { TextInput } from 'modules/common/form';
import { XIcon, AddIcon } from 'modules/common/icons';

import Styles from 'modules/create-market/components/common.styles';

export interface HeaderProps {
  text: string;
  children?: Array<any>;
}

export const Header = (props: HeaderProps) => (
  <h1 className={Styles.Header}>
    {props.children ? props.children : props.text}
  </h1>
);

export const LargeHeader = (props: HeaderProps) => (
  <span className={Styles.LargeHeader}>
    {props.children ? props.children : props.text}
  </span>
);

export const MediumHeader = (props: HeaderProps) => (
  <span className={Styles.MediumHeader}>
    {props.children ? props.children : props.text}
  </span>
);

export interface SubheadersProps {
  header: string;
  subheader: string;
  link?: Boolean;
  href?: string;
  underlineLink?: Boolean;
  linkOwnLine?: Boolean;
}

export const Subheaders = (props: SubheadersProps) => (
  <div className={Styles.Subheaders}>
    <h1>{props.header}</h1>
    <p>
      <span>{props.subheader}</span>
      {props.link && (
        <Link href={props.href} underline={props.underlineLink} ownLine={props.linkOwnLine} />
      )}
    </p>
  </div>        
);

export interface XLargeSubheadersProps {
  header: string;
  subheader: string;
  children?: Array<any>;
}

export const XLargeSubheaders = (props: XLargeSubheadersProps) => (
  <div className={Styles.XLargeSubheaders}>
    <LargeHeader text={props.header} />
    <MediumHeader text={props.subheader}>
      {props.children}
    </MediumHeader>
  </div>        
);

export interface HeaderLinkProps {
  text: string;
  href?: string;
  link?: Boolean;
  linkOwnLine?: Boolean;
  underlineLink?: Boolean;
}

export const SmallHeaderLink = (props: HeaderLinkProps) => (
  <p className={Styles.SmallHeaderLink}>
    <span>{props.text}</span>
    {props.link && (
      <Link href={props.href} underline={props.underlineLink} ownLine={props.linkOwnLine} />
    )}
  </p>
);

export const LargeSubheaders = (props: SubheadersProps) => (
  <div className={Styles.LargeSubheaders}>
    <Header text={props.header} />
    <SmallHeaderLink 
      text={props.subheader} 
      href={props.href} 
      underline={props.underlineLink} 
      ownLine={props.linkOwnLine} 
      link={props.link} 
    />
  </div>        
);

export interface LinkProps {
  href?: string;
  underline?: Boolean;
  ownLine?: Boolean;
}

export const Link = (props: LinkProps) => (
  <a 
    className={classNames(Styles.Link, {[Styles.underline]: props.underline, [Styles.ownLine]: props.ownLine})} 
    target="blank" 
    href={props.href || "https://docs.augur.net"}
  >
    Learn more
  </a>      
);

export const SmallSubheaders = (props: SubheadersProps) => (
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

export interface NumberedInputProps {
  value: string;
  removable: boolean;
  number: number;
  placeholder: string;
  onChange: Function;
  onRemove?: Function;
}

export interface NumberedListProps {
  initialList: Array<string>;
  minShown: number;
  maxList: number;
  placeholder: string;
  updateList: Function;
}

export interface NumberedListState {
  list: Array<string>;
  isFull: boolean;
  isMin: boolean;
}

export const NumberedInput = ({
  number,
  value,
  placeholder,
  onChange,
  removable,
  onRemove,
}: NumberedInputProps) => (
  <li key={number} className={Styles.NumberedInput}>
    <span>{`${number + 1}.`}</span>
    <TextInput
      onChange={value => onChange(value, number)}
      value={value}
      placeholder={placeholder}
    />
    {removable && <button onClick={e => onRemove(number)}>{XIcon}</button>}
  </li>
);

export class NumberedList extends Component<
  NumberedListProps,
  NumberedListState
> {
  state: NumberedListState = {
    list: this.props.initialList,
    isFull: this.props.initialList.length === this.props.maxList,
    isMin: this.props.initialList.length === this.props.minShown,
  };

  onChange = (value, index) => {
    const { updateList } = this.props;
    const { list } = this.state;
    list[index] = value;
    this.setState({ list }, updateList(list));
  };

  addItem = () => {
    const { isFull, list } = this.state;
    const { maxList, minShown, updateList } = this.props;
    if (!isFull) {
      list.push('');
      this.setState(
        {
          list,
          isFull: list.length === maxList,
          isMin: list.length === minShown,
        },
        updateList(list)
      );
    }
  };

  removeItem = index => {
    const { isMin, list } = this.state;
    const { minShown, maxList, updateList } = this.props;
    if (!isMin) {
      list.splice(index, 1);
      this.setState(
        {
          list,
          isMin: list.length === minShown,
          isFull: list.length === maxList,
        },
        updateList(list)
      );
    }
  };

  render() {
    const { list, isFull } = this.state;
    const { placeholder, minShown } = this.props;

    return (
      <ul className={Styles.NumberedList}>
        {list.map((item, index) => (
          <NumberedInput
            value={item}
            placeholder={placeholder}
            onChange={this.onChange}
            number={index}
            removable={index >= minShown}
            onRemove={this.removeItem}
          />
        ))}
        <li>
          <SecondaryButton
            disabled={isFull}
            text="Add"
            action={e => this.addItem()}
            icon={AddIcon}
          />
        </li>
      </ul>
    );
  }
}
