import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { DEFAULT_DERIVATION_PATH } from "modules/auth/helpers/derivation-path";

import Styles from "modules/auth/components/common/derivation-path-editor.styles";
import FormStyles from "modules/common/less/form";

export default class DerivationPathEditor extends Component {
  static propTypes = {
    validatePath: PropTypes.func.isRequired,
    isClicked: PropTypes.bool.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      selectedDefaultPath: true,
      customPath: ""
    };

    this.selectDerivationPath = this.selectDerivationPath.bind(this);
    this.focusTextInput = this.focusTextInput.bind(this);
    this.setPath = this.setPath.bind(this);
    this.clearState = this.clearState.bind(this);
  }

  componentDidUpdate(nextProps, nextState) {
    if (this.props.isClicked && !nextProps.isClicked) {
      this.clearState();
    }
  }

  setPath(customPath) {
    this.setState({ customPath });
    this.props.validatePath(customPath);
  }

  clearState() {
    this.setState({ customPath: "", selectedDefaultPath: true });
  }

  selectDerivationPath(selectedDefaultPath) {
    const { validatePath } = this.props;
    const { customPath } = this.state;
    this.setState({ selectedDefaultPath });
    if (!selectedDefaultPath && customPath !== "") {
      validatePath(customPath);
    } else if (selectedDefaultPath) {
      validatePath(DEFAULT_DERIVATION_PATH);
    }
    if (!selectedDefaultPath) {
      this.focusTextInput();
    } else {
      this.derivationInput.blur();
    }
  }

  focusTextInput() {
    this.derivationInput.focus();
  }

  render() {
    const s = this.state;

    return (
      <section className={Styles.DerivationPathEditor}>
        <div className={Styles.DerivationPathEditor__title}>
          Derivation Path
        </div>
        <div className={Styles.DerivationPathEditor__row}>
          <ul
            className={classNames(
              FormStyles["Form__radio-buttons--per-line"],
              Styles.DerivationPathEditor__radioButtons
            )}
          >
            <li>
              <button
                className={classNames({
                  [`${FormStyles.active}`]: s.selectedDefaultPath
                })}
                onClick={() => this.selectDerivationPath(true)}
              >
                <span className={Styles.DerivationPathEditor__path}>
                  {DEFAULT_DERIVATION_PATH}
                </span>
                <span className={Styles.DerivationPathEditor__pathDetails}>
                  (default)
                </span>
              </button>
            </li>
          </ul>
        </div>
        <div className={Styles.DerivationPathEditor__row}>
          <ul
            className={classNames(
              FormStyles["Form__radio-buttons--per-line"],
              Styles.DerivationPathEditor__radioButtons,
              Styles.DerivationPathEditor__radioButtonsInput
            )}
          >
            <li>
              <button
                className={classNames({
                  [`${FormStyles.active}`]: !s.selectedDefaultPath
                })}
                onClick={() => this.selectDerivationPath(false)}
              >
                <span
                  className={classNames(
                    Styles.DerivationPathEditor__path,
                    Styles.DerivationPathEditor__pathInputContainer
                  )}
                >
                  <input
                    className={Styles.DerivationPathEditor__pathInput}
                    type="text"
                    ref={derivationInput => {
                      this.derivationInput = derivationInput;
                    }}
                    value={s.customPath}
                    placeholder={DEFAULT_DERIVATION_PATH}
                    onChange={e => this.setPath(e.target.value)}
                  />
                </span>
              </button>
            </li>
          </ul>
        </div>
      </section>
    );
  }
}
