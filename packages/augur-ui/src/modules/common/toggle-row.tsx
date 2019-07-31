import React, { ReactNode } from "react";
import classNames from "classnames";

import ChevronFlip from "modules/common/chevron-flip";

import Styles from "modules/common/toggle-row.styles";

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
    const { open } = this.state;
    this.setState({ open: !open });
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
          className={classNames(className, Styles.Row, {
            [Styles.RowActive]: open
          })}
          onClick={this.toggleRow}
          role="button"
          tabIndex={0}
        >
          <div
            className={classNames(
              Styles.RowContainer,
              innerClassName
            )}
          >
            <div className={Styles.RowContent}>
              {rowContent}
              <span
                className={classNames(
                  Styles.ArrowContainer,
                  arrowClassName
                )}
              >
                <ChevronFlip
                  containerClassName={Styles.Arrow}
                  pointDown={open}
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
