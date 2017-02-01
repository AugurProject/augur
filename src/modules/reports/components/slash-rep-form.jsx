import React, { Component } from 'react';
import classnames from 'classnames';
import Checkbox from 'modules/common/components/checkbox';

export default class SlashRepForm extends Component {
  // TODO -- Prop Validations
  static propTypes = {};

  constructor(props) {
    super(props);
    this.state = {
      reporter: undefined,
      report: undefined,
      salt: undefined,
      isIndeterminate: false,
      isUnethical: false
    };
  }

  render() {
    const p = this.props;
    const s = this.state;
    return (
      <article className="slash-rep-form">
        <div className="slash-rep-message">
          It is important for Augur&#39;s security that Reporters keep their reports <b>secret</b> until the first half of the reporting cycle is complete (in ${p.branch.phaseTimeRemaining}).  If another Reporter has disclosed their Report (and its accompanying randomly-generated unique identifier) to you, you can enter the other Reporter&#39;s reported values here and you will receive half of their Reputation balance.  (Note: there is no penalty to you if this fails.  The other Reporter will only be notified if the information you enter matches their report.)
        </div>
        <label htmlFor="slash-rep-reporter">
          <h4>Ethereum address of cheater</h4>
          <input
            type="text"
            className="slash-rep-input"
            name="slash-rep-reporter"
            value={s.reporter}
            onChange={reporter => this.handleSlashRepChange({ reporter })}
          />
        </label>
        <label htmlFor="slash-rep-report">
          <h4>Outcome reported by cheater</h4>
          <input
            type="text"
            className="slash-rep-input"
            name="slash-rep-report"
            disabled={!!s.isIndeterminate}
            value={s.report}
            onChange={report => this.setState({ report })}
          />
          <Checkbox
            text="Indeterminate"
            isChecked={s.isIndeterminate}
            onClick={isIndeterminate => this.setState({ isIndeterminate })}
          />
          <Checkbox
            text="Unethical"
            isChecked={s.isUnethical}
            onClick={isUnethical => this.setState({ isUnethical })}
          />
        </label>
        <label htmlFor="slash-rep-salt">
          <h4>Report&#39;s unique ID (salt)</h4>
          <input
            type="text"
            className="slash-rep-input"
            name="slash-rep-salt"
            value={s.salt}
            onChange={salt => this.setState({ salt })}
          />
        </label>
	      <div className="submit-slash-rep">
	        <button
	          className="button"
	          disabled={(!s.reporter && !s.report && !s.salt)}
	          onClick={() => p.onSubmitSlashRep(s.salt, s.report, s.reporter, s.isIndeterminate, s.isUnethical)}
	        >
	          Fine Reporter
	        </button>
	      </div>
      </article>
    );
  }
 }
