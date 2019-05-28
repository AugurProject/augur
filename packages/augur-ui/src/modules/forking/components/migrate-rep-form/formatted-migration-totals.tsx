import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { createBigNumber } from "utils/create-big-number";

import FormStyles from "modules/common/less/form";
import selectMigrateTotals from "modules/reports/selectors/select-migrated-totals";
import Styles from "modules/forking/components/migrate-rep-form/migrate-rep-form.styles";

export default class FormattedMigrationTotals extends Component {
  static propTypes = {
    selectedOutcome: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    currentBlockNumber: PropTypes.number.isRequired,
    getForkMigrationTotals: PropTypes.func.isRequired,
    market: PropTypes.object.isRequired,
    validateOutcome: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      formattedMigrationTotals: null,
      blockNumber: props.currentBlockNumber
    };
  }

  componentWillMount() {
    this.getForkMigrationTotals();
  }

  componentWillReceiveProps(newProps) {
    const updateBlock = createBigNumber(this.state.blockNumber);
    const currentBlock = createBigNumber(newProps.currentBlockNumber);
    if (currentBlock.gt(updateBlock)) {
      this.setState({
        blockNumber: newProps.currentBlockNumber
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const updateBlock = createBigNumber(this.state.blockNumber);
    const currentBlock = createBigNumber(nextProps.currentBlockNumber);
    if (currentBlock.gt(updateBlock)) return true;
    return false;
  }

  componentWillUpdate() {
    this.getForkMigrationTotals();
  }

  getForkMigrationTotals() {
    const { getForkMigrationTotals, market } = this.props;
    getForkMigrationTotals((err, forkMigrationTotals) => {
      if (err) return console.error(err);
      const { reportableOutcomes } = market;
      const formattedMigrationTotals = selectMigrateTotals(
        reportableOutcomes,
        forkMigrationTotals
      );
      this.setState({
        formattedMigrationTotals
      });
    });
  }

  render() {
    const { selectedOutcome, validateOutcome } = this.props;

    const { formattedMigrationTotals } = this.state;

    return (
      <ul className={FormStyles["Form__radio-buttons--per-line"]}>
        {formattedMigrationTotals &&
          formattedMigrationTotals.length > 0 &&
          formattedMigrationTotals.map(outcome => (
            <li key={outcome.id}>
              <button
                className={classNames({
                  [`${FormStyles.active}`]: selectedOutcome === outcome.id,
                  [FormStyles.isInvalidField]: outcome.name === "Indeterminate"
                })}
                onClick={e => {
                  validateOutcome(outcome.id, outcome.name, false);
                }}
              >
                {outcome.name === "Indeterminate"
                  ? "Market is Invalid"
                  : outcome.name}
                <span className={Styles.MigrateRepForm__outcome_rep_total}>
                  {(outcome && outcome.rep.formatted) || "0"} REP Migrated
                </span>
                {outcome &&
                  outcome.winner && (
                    <span className={Styles.MigrateRepForm__winning_outcome}>
                      {" "}
                      WINNING UNIVERSE
                    </span>
                  )}
              </button>
            </li>
          ))}
      </ul>
    );
  }
}
