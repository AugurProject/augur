let React = require('react');

let moment = require("moment");

let DatePicker = require("react-date-picker");
let Input = require("react-bootstrap/lib/Input");

let MarketCreateStep1 = React.createClass({
    getInitialState() {
        return {
            minDate: moment()
        }
    },

    validate() {

    },

    onSubmit(event) {
        event.preventDefault();


    },

    getPlaceholderText(marketType) {
        switch (marketType) {
            case "binary":
                return 'Will "Batman v Superman: Dawn of Justice" take more than $150 million box in office receipts opening weekend?';
            case "categorical":
                return "Who will win the Four Nations Rugby Championship in 2016?";
            case "scalar":
                return "What will the price of oil be at the end of 2016?";
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
                let categoricalOutcomes = this.props.categoricalChoices;

                return (
                    <div className="form-group">
                        <label for="">What are the possible answers to your question?</label>
                        <p>
                            All possible outcomes to your question must be covered by these answers. You can add an
                            "any other outcome" type answer at the end to ensure everything is covered.
                        </p>
                        {
                            categoricalOutcomes.map((outcome, index) => {
                                return (
                                    <Input
                                        key={index}
                                        data-index={index}
                                        type="text"
                                        // label={"Answer " + (i + 1)}
                                        help={this.props.categoricalChoiceErrors[index]}
                                        //bsStyle={this.state.choiceTextError[i] ? "error" : null}
                                        value={outcome}
                                        //placeholder={placeholderText}
                                        //wrapperClassName="row clearfix col-lg-12"
                                        onChange={this.props.onChangeCategoricalChoices} />
                                );
                            }, this)
                        }
                        <div className="form-group">
                            <button className="btn btn-default" onClick={this.props.onAddCategoricalOutcome}>
                                <span className="">+</span> Add another answer
                            </button>
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
                            // label="Minimum"
                            help={this.props.minValueError}
                            bsStyle={this.props.minValueError ? "error" : null}
                            value={this.props.minValue}
                            placeholder="Minimum answer"
                            wrapperClassName="row clearfix col-lg-12"
                            onChange={this.props.onChangeMinimum} />
                        <label for="">Maximum</label>
                        <Input
                            type="number"
                            // label="Maximum"
                            help={this.props.maxValueError}
                            bsStyle={this.props.maxValueError ? "error" : null}
                            value={this.props.maxValue}
                            placeholder="Maximum answer"
                            wrapperClassName="row clearfix col-lg-12"
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
        let placeholderText = this.getPlaceholderText(marketType);
        let additionalQuestionInfo = this.getAdditionalQuestionInfo(marketType);

        return (
            <div>
                <h1>What's your question?</h1>

                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label for="marketText">
                            What do you want to ask?/
                        </label>
                        <Input
                            standalone={true}
                            id="marketText"
                            type="text"
                            help={this.props.marketTextError}
                            value={this.props.marketText}
                            placeholder={placeholderText}
                            onChange={this.props.onChangeMarketText} />

                    </div>
                    { additionalQuestionInfo }
                    <div className="form-group">
                        <label for="">What's the end date for your question?</label>
                        <DatePicker
                            minDate={this.state.minDate}
                            hideFooter={true}
                            onChange={this.props.onEndDatePicked} />
                    </div>
                    <div className="form-group">
                        <label for="">Question checklist</label>
                        todo?
                    </div>
                    <div className="form-group">
                        <button type="submit">
                            Next
                        </button>
                    </div>
                </form>
            </div>
        )
    }
});

module.exports = MarketCreateStep1;