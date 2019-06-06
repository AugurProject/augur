import React, { ReactNode } from "react";
import classNames from "classnames";

import ChevronFlip from "modules/common-elements/chevron-flip";

import Styles from "modules/common-elements/toggle-row.styles";

export interface ToggleRowProps {
  rowContent: ReactNode;
  toggleContent: ReactNode;
  style?: Object;
  className?: string;
  arrowClassName?: string;
  innerClassName?: string;
}

interface ToggleRowState {
  open: Boolean;
}

export default class ToggleRow extends React.Component<
  ToggleRowProps,
  ToggleRowState
> {
  state: ToggleRowState = {
    open: false
  };

  toggleRow = () => {
    this.setState({ open: !this.state.open });
  };

  render() {
    const {
      rowContent,
      toggleContent,
      className,
      arrowClassName,
      innerClassName
    } = this.props;
    const { open } = this.state;

    return (
      <div className={Styles.ToggleRow}>
        <div
          className={classNames(className, Styles.ToggleRow__row, {
            [Styles.ToggleRow__rowActive]: open
          })}
          onClick={this.toggleRow}
          role="button"
          tabIndex={0}
        >
          <div
            className={classNames(
              Styles.ToggleRow__rowContainer,
              innerClassName
            )}
          >
            <div className={Styles.ToggleRow__rowContent}>
              {rowContent}
              <span
                className={classNames(
                  Styles.ToggleRow__arrowContainer,
                  arrowClassName
                )}
              >
                <ChevronFlip
                  containerClassName={Styles.ToggleRow__arrow}
                  pointDown={open}
                  stroke="#999999"
                  quick
                  filledInIcon
                  hover
                />
              </span>
            </div>
          </div>
        </div>
        {open && (
          <div className={classNames(Styles.ToggleContent)}>
            {toggleContent}
          </div>
        )}
      </div>
    );
  }
}
