import React from "react";

import {
  Title,
  ButtonsRow,
  SelectableTable,
  AlertMessage
} from "modules/modal/common";

import Styles from "modules/modal/modal.styles";

interface GasProps {
  saveAction: Function;
  closeAction: Function;
  safeLow: number;
  average: number;
  fast: number;
  blockNumber: number;
  userDefinedGasPrice?: number;
}

interface GasState {
  amount: number;
  showLowAlert: boolean;
}

export class Gas extends React.Component<GasProps, GasState> {
  state: GasState = {
    amount: this.props.userDefinedGasPrice || this.props.average,
    showLowAlert:
      (this.props.userDefinedGasPrice || this.props.average) <
      this.props.safeLow
  };

  updateAmount(amount: number) {
    let amt = this.state.amount;
    if (amount) amt = amount;
    this.setState({ amount: amt, showLowAlert: amt < this.props.safeLow });
  }

  render() {
    const { closeAction, saveAction, safeLow, average, fast } = this.props;
    const { amount, showLowAlert } = this.state;
    const disabled = !amount || amount <= 0;

    const buttons = [
      {
        text: "Save",
        action: () => saveAction(amount),
        disabled
      }
    ];
    const tableData = [
      {
        columns: ["Speed", "Gas Price (gwei)"],
        action: () => {}
      },
      {
        columns: ["Slow (<30m)", safeLow],
        action: () => {
          this.updateAmount(safeLow);
        }
      },
      {
        columns: ["Standard (<5m)", average],
        action: () => this.updateAmount(average)
      },
      {
        columns: ["Fast (<2m)", fast],
        action: () => this.updateAmount(fast)
      }
    ];

    return (
      <div className={Styles.Gas}>
        <Title title="Gas Price (gwei)" closeAction={closeAction} />
        <main>
          {showLowAlert && (
            <AlertMessage preText="Transactions are unlikely to be processed at your current gas price." />
          )}
          <input
            id="price"
            placeholder="price"
            step={1}
            type="number"
            value={this.state.amount}
            onChange={e => {
              this.updateAmount(parseFloat(e.target.value));
            }}
          />
          <h2>Recommended Gas Price</h2>
          <p>(based on current network conditions)</p>
          <SelectableTable tableData={tableData} />
        </main>
        <ButtonsRow buttons={buttons} />
      </div>
    );
  }
}
