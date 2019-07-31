import React, { Component } from 'react';
import classNames from 'classnames';

import { SecondaryButton } from 'modules/common/buttons';
import { TextInput } from 'modules/common/form';
import { XIcon, AddIcon, HintAlternate } from 'modules/common/icons';
import ReactTooltip from "react-tooltip";
import TooltipStyles from "modules/common/tooltip.styles.less";
import Link from "modules/create-market/containers/link";

import Styles from 'modules/create-market/components/common.styles';

export interface HeaderProps {
  text: string;
  children?: Array<any>;
}

export const Header = (props: HeaderProps) => (
  <h2 className={Styles.Header}>
    {props.children ? props.children : props.text}
  </h2>
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
  underline?: Boolean;
  ownLine?: Boolean;
  smallSubheader?: Boolean;
}

export const Subheaders = (props: SubheadersProps) => (
  <div className={Styles.Subheaders}>
    <h1>{props.header}</h1>
    <p>
      <span>{props.subheader}</span>
      {props.link && (
        <Link href={props.href} underline={props.underline} ownLine={props.ownLine} />
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
  ownLine?: Boolean;
  underline?: Boolean;
  smallSubheader?: Boolean;
}

export const SmallHeaderLink = (props: HeaderLinkProps) => (
  <p className={classNames(Styles.SmallHeaderLink, {[Styles.XSmall]: props.smallSubheader})}>
    <span>{props.text}</span>
    {props.link && (
      <Link href={props.href} underline={props.underline} ownLine={props.ownLine} />
    )}
  </p>
);

export const LargeSubheaders = (props: SubheadersProps) => (
  <div className={classNames(Styles.LargeSubheaders, {[Styles.Small]: props.smallSubheader})}>
    <Header text={props.header} />
    <SmallHeaderLink 
      text={props.subheader} 
      href={props.href} 
      underline={props.underline} 
      ownLine={props.ownLine} 
      link={props.link} 
      smallSubheader={props.smallSubheader}
    />
  </div>        
);

export const SmallSubheaders = (props: SubheadersProps) => (
  <div className={Styles.SmallSubheaders}>
    <h1>{props.header}</h1>
    <span>
      {props.subheader}
    </span>
  </div>        
);

export interface SubheadersTooltipProps {
  header: string;
  subheader: string;
  link?: Boolean;
  href?: string;
  underline?: Boolean;
  ownLine?: Boolean;
  smallSubheader?: Boolean;
  text: string;
  tooltipSubheader?: Boolean;
}

export const SmallSubheadersTooltip = (props: SubheadersTooltipProps) => (
  <div className={Styles.SmallSubheadersTooltip}>
    <h1>
      {props.header}
      {!props.tooltipSubheader && 
        <>
          <label
            className={TooltipStyles.TooltipHint}
            data-tip
            data-for={`tooltip-${props.header}`}
          >
            {HintAlternate}
          </label>
          <ReactTooltip
            id={`tooltip-${props.header}`}
            className={TooltipStyles.Tooltip}
            effect="solid"
            place="top"
            type="light"
            data-event="mouseover"
            data-event-off="blur scroll"
          >
            {props.text}
          </ReactTooltip>
        </>
      }
    </h1>
    <span>
      {props.subheader}
      {props.tooltipSubheader &&
        <> 
          <label
            className={TooltipStyles.TooltipHint}
            data-tip
            data-for={`tooltip-${props.header}`}
          >
            {HintAlternate}
          </label>
          <ReactTooltip
            id={`tooltip-${props.header}`}
            className={TooltipStyles.Tooltip}
            effect="solid"
            place="top"
            type="light"
            data-event="mouseover"
            data-event-off="blur scroll"
          >
            {props.text}
          </ReactTooltip>
        </>
      }
    </span>
  </div>        
);


export interface OutcomesListProps {
  outcomes: Array<string>;
}

export const OutcomesList = (props: OutcomesListProps) => (
  <div className={Styles.OutcomesList}>
    <h1>Outcomes</h1>
    <div>
      {props.outcomes.map((outcome:string, index: Number) => 
        <span key={index}>
          {index + 1}. {outcome}
        </span>
      )}
    </div>
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
    {props.subtexts.map((subtext, index) => 
      <p key={index}>
        {subtext}
      </p>
    )}
  </div>      
);

export interface ContentBlockProps {
  children: Array<any>;
  noDarkBackground?: Boolean;
  dark?: Boolean;
}

export const ContentBlock = (props: ContentBlockProps) => (
  <div className={classNames(Styles.ContentBlock, {[Styles.NoDark]: props.noDarkBackground, [Styles.Dark]: props.dark})}>
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
  errorMessage?: strinng;
}

export interface NumberedListProps {
  initialList: Array<string>;
  minShown: number;
  maxList: number;
  placeholder: string;
  updateList: Function;
  errorMessage?: string;
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
  errorMessage
}: NumberedInputProps) => (
  <li key={number} className={Styles.NumberedInput}>
    <span>{`${number + 1}.`}</span>
    <TextInput
      onChange={value => onChange(value, number)}
      value={value}
      placeholder={placeholder}
      errorMessage={errorMessage}
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
    this.setState({ list }, () => updateList(list));
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
        () => updateList(list)
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
        () => updateList(list)
      );
    }
  };

  render() {
    const { list, isFull } = this.state;
    const { placeholder, minShown, errorMessage } = this.props;

    return (
      <ul className={Styles.NumberedList}>
        {list.map((item, index) => (
          <NumberedInput
            key={index}
            value={item}
            placeholder={placeholder}
            onChange={this.onChange}
            number={index}
            removable={index >= minShown}
            onRemove={this.removeItem}
            errorMessage={errorMessage[index]}
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
