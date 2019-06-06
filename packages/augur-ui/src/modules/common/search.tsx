/* eslint-disable jsx-a11y/no-static-element-interactions */ // can't have button within a button

import * as React from "react";
import classNames from "classnames";
import Styles from "modules/common-elements/search.styles";
import { SearchIcon } from "modules/common-elements/icons";

export interface SearchBarProps {
  onChange: (value: string) => void;
  placeholder?: string;
  onFocus: Function;
}

export interface SearchBarState {
  isFocused: boolean;
}

export class SearchBar extends React.Component<SearchBarProps, SearchBarState> {
  state: SearchBarState = {
    isFocused: false
  };

  componentDidMount() {
    window.addEventListener("click", this.handleWindowOnClick);
  }

  componentWillUnmount() {
    window.removeEventListener("click", this.handleWindowOnClick);
  }

  refContainer: any = null;
  refSearch: any = null;

  handleWindowOnClick = (event: React.MouseEvent<HTMLElement>) => {
    if (this.refContainer && this.refContainer.contains(event.target)) {
      this.refSearch.focus();
    }
  };

  handlerClicked = () => {
    this.setState({ isFocused: true });
    this.props.onFocus(false);
  };

  deFocus = e => {
    this.setState({ isFocused: false });
    this.props.onFocus(true);
    this.refSearch.value = "";
    this.props.onChange("");
    e.stopPropagation();
  };

  render() {
    const { onChange, placeholder } = this.props;
    const placeholderText = placeholder || "Search";
    const { isFocused } = this.state;

    return (
      <div
        className={classNames(Styles.SearchBar__container, {
          [Styles.SearchBar__containerFocused]: isFocused
        })}
      >
        <div
          className={classNames(Styles.SearchBar, {
            [Styles.isFocused]: isFocused
          })}
          ref={container => {
            this.refContainer = container;
          }}
          onClick={this.handlerClicked}
        >
          <input
            ref={search => {
              this.refSearch = search;
            }}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholderText}
          />
          <div>Search</div>
          {SearchIcon}
        </div>

        <button onClick={this.deFocus}>cancel</button>
      </div>
    );
  }
}
