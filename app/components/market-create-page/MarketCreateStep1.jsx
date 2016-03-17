let React = require('react');

let moment = require("moment");

let DatePicker = require("react-date-picker");
let Input = require("react-bootstrap/lib/Input");

let constants = require("../../libs/constants");

let MarketCreateStep1 = React.createClass({
    getInitialState() {
        return {
            minDate: moment()
        }
    },

    onSubmit(event) {
        event.preventDefault();

        this.props.goToNextStep();
    },

    getPlaceholderText(marketType) {
        switch (marketType) {
            case "binary":
                return 'Will "Batman v Superman: Dawn of Justice" take more than $150 million box in office receipts opening weekend?';
            case "categorical":
                return "Who will win the Four Nations Rugby Championship in 2016?";
            case "scalar":
                return "What will the temperature (in degrees Fahrenheit) be in San Francisco, California, on July 1, 2016?";
            default:
                console.warn("MarketCreateStep1[getPlaceholderText]: Unknown market type %o", marketType);
                return "";
        }
    },
    getAdditionalQuestionInfo(marketType) {
        switch (marketType) {
            case "binary":
                return null;
            case "categorical": {
                let categoricalOutcomes = this.props.choices;
                let placeholders = ["New Zealand", "Australia", "South Africa", "Argentina"];

                return (
                    <div className="form-group">
                        <h4>What are the possible answers to your question? (required)</h4>
                        <p>
                            All possible outcomes to your question must be covered by these answers. You can add an
                            "any other outcome" type answer at the end to ensure everything is covered.
                        </p>
                        <div className="row">
                            <div className="col-sm-6 form-horizontal">
                                {
                                    categoricalOutcomes.map((outcome, index) => {
                                        let removeAction;
                                        if (index > 1) {
                                            removeAction = (
                                                <button className="btn btn-default" data-index={index}
                                                        onClick={this.props.onRemoveCategoricalOutcome}>
                                                    <span className="fa fa-times"></span>
                                                </button>
                                            );
                                        }
                                        return (
                                            <Input
                                                key={index}
                                                data-index={index}
                                                wrapperClassName="col-sm-5"
                                                type="text"
                                                bsStyle={this.props.choiceErrors[index] != null ? "error" : null}
                                                help={this.props.choiceErrors[index]}
                                                value={outcome}
                                                placeholder={placeholders[index]}
                                                onChange={this.props.onChangeChoice}
                                                buttonAfter={removeAction}/>
                                        );
                                    }, this)
                                }
                                { categoricalOutcomes.length < constants.MAX_ALLOWED_OUTCOMES &&
                                    <div className="form-group">
                                        <div className="col-xs-12">
                                            <button className="btn btn-default" onClick={this.props.onAddCategoricalOutcome}>
                                                Add another answer
                                            </button>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                );
            }
            case "scalar":
                return (
                    <div className="form-group">
                        <label for="">What are the minimum and maximum values allowed when answering?</label>
                        <p>
                            The answer to your question must be a number that falls between the minimum and maximum
                            values you're about to set.
                        </p>
                        <label for="">Minimum</label>
                        <Input
                            type="number"
                            help={this.props.minValueError}
                            bsStyle={this.props.minValueError != null ? "error" : null}
                            value={this.props.minValue}
                            placeholder="Minimum answer"
                            onChange={this.props.onChangeMinimum} />

                        <label for="">Maximum</label>
                        <Input
                            type="number"
                            help={this.props.maxValueError}
                            bsStyle={this.props.maxValueError != null ? "error" : null}
                            value={this.props.maxValue}
                            placeholder="Maximum answer"
                            onChange={this.props.onChangeMaximum} />
                    </div>
                );
            default:
                console.warn("MarketCreateStep1[getAdditionalQuestionInfo]: Unknown market type %o", marketType);
                return null;
        }
    },

    render() {
        let marketType = this.props.marketType;
        return (
            <div>
                <h1>What's your question?</h1>

                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <h4>
                            What do you want to ask? (required)
                        </h4>
                        <Input
                            style={{width: "100%"}}
                            standalone={true}
                            type="text"
                            bsStyle={this.props.marketTextError != null ? "error" : null}
                            help={this.props.marketTextError}
                            value={this.props.marketText}
                            placeholder={this.getPlaceholderText(marketType)}
                            onChange={this.props.onChangeMarketText} />

                    </div>
                    { this.getAdditionalQuestionInfo(marketType) }
                    <div className={`form-group ${this.props.maturationDateError != null ? "has-error" : null}`}>
                        <h4>What's the end date for your question? (required)</h4>
                        <DatePicker
                            minDate={this.state.minDate}
                            date={this.props.maturationDate}
                            hideFooter={true}
                            onChange={this.props.onEndDatePicked} />

                        <span className={this.props.maturationDateError != null ? "has-error" : null}>
                            <span className="help-block">
                                { this.props.maturationDateError }
                            </span>
                        </span>
                    </div>
                    <div className="form-group">
                        <button className="btn btn-primary" type="button" onClick={this.props.onMarketTypeChange}>
                            Back
                        </button>
                        <button className="btn btn-primary" type="submit">
                            Next (Additional market information)
                        </button>
                    </div>
                </form>
            </div>
        )
    }
});

module.exports = MarketCreateStep1;