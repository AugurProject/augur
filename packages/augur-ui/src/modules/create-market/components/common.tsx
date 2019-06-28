import React, { Component } from 'react';
import classNames from 'classnames';

import { SecondaryButton } from 'modules/common/buttons';
import { TextInput } from 'modules/common/form';
import { XIcon, AddIcon } from 'modules/common/icons';

import Styles from 'modules/create-market/components/common.styles';

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
      {props.link && (
        <a target="blank" href="https://docs.augur.net">
          Learn more
        </a>
      )}
    </span>
  </div>        
);

export interface SmallSubheadersProps {
  header: string;
  subheader: string;
}

export const SmallSubheaders = (props: SmallSubheadersProps) => (
  <div className={Styles.SmallSubheaders}>
    <h1>{props.header}</h1>
    <span>
      {props.subheader}
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
        <span>
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
