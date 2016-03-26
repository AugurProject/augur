let React = require('react');

let Button = require("react-bootstrap/lib/Button");
let Input = require("react-bootstrap/lib/Input");

let MarketCreateStep2 = React.createClass({
    onSubmit(event) {
        event.preventDefault();

        this.props.goToNextStep();
    },
    render() {
        return (
            <div>
                <h1>
                    Additional market information
                </h1>

                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <h4>What is the source of expiry information for your question? (required)</h4>

                        <Input
                            value="generic"
                            standalone={true}
                            type="radio"
                            checked={this.props.expirySource === "generic"}
                            label="Outcome will be covered by local, national or international news media."
                            labelClassName=""
                            wrapperClassName=""
                            onChange={this.props.onChangeExpirySource} />
                        <Input
                            value="specific"
                            standalone={true}
                            type="radio"
                            bsStyle={this.props.expirySourceUrlError != null ? "error" : null}
                            checked={this.props.expirySource === "specific"}
                            label="Outcome will be detailed on a specific publicly available website:"
                            labelClassName=""
                            wrapperClassName=""
                            onChange={this.props.onChangeExpirySource} />
                        <div className="col-sm-12" style={{display: this.props.expirySource === "specific" ? "" : "none"}}>
                            <Input
                                type="text"
                                bsStyle={this.props.expirySourceUrlError != null ? "error" : null}
                                help={this.props.expirySourceUrlError}
                                value={this.props.expirySourceUrl}
                                placeholder="http://www.boxofficemojo.com"
                                onChange={this.props.onChangeExpirySourceUrl} />
                        </div>
                    </div>

                    <div className="form-group">
                        <h4>
                            Add some tags to your market (optional)
                        </h4>
                        <p>
                            Up to three tags can be added to categorize your market. For example: politics, sports,
                            entertainment or technology.
                        </p>
                        <div className="row">
                            <div className="col-sm-6 form-horizontal">
                                {
                                    this.props.tags.map((tag, index) => {
                                        let removeAction = (
                                            <button className="btn btn-default"
                                                    type="button"
                                                    data-index={index}
                                                    onClick={this.props.onRemoveTag}>
                                                <span className="fa fa-times"></span>
                                            </button>
                                        );

                                        return (
                                            <Input
                                                key={index}
                                                data-index={index}
                                                wrapperClassName="col-sm-5"
                                                bsStyle={this.props.tagErrors[index] != null ? "error" : null}
                                                help={this.props.tagErrors[index]}
                                                type="text"
                                                buttonAfter={removeAction}
                                                value={tag}
                                                onChange={this.props.onChangeTagText} />
                                        )
                                    }, this)
                                }
                                { this.props.tags.length < this.props.maxAllowedTags &&
                                    <div className="form-group">
                                        <div className="col-xs-12">
                                            <Button bsStyle="default" onClick={this.props.onAddTag}>
                                                Add tag
                                            </Button>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <h4>Does your question need further explanation? (optional)</h4>
                        <p>Your question: {this.props.plainMarketText}</p>
                        <Input
                            type="textarea"
                            style={{width: "100%", height: "110px"}}
                            value={this.props.detailsText}
                            placeholder="Optional: enter a more detailed description of your market."
                            onChange={this.props.onChangeDetailsText} />
                    </div>

                    <div className="form-group">
                        <h4>Are there any helpful links you want to add? (optional)</h4>
                        <p>
                            For example, if your question is about an election you could link to polling information or
                            the webpages of candidates.
                        </p>
                        <div className="row">
                            <div className="col-sm-6 form-horizontal">
                                {
                                    this.props.resources.map((resource, index) => {
                                        let removeAction = (
                                            <button className="btn btn-default"
                                                    type="button"
                                                    data-index={index}
                                                    onClick={this.props.onRemoveResource}>
                                                <span className="fa fa-times"></span>
                                            </button>
                                        );

                                        return (
                                            <Input
                                                key={index}
                                                data-index={index}
                                                wrapperClassName="col-sm-5"
                                                type="text"
                                                bsStyle={this.props.resourceErrors[index] != null ? "error" : null}
                                                help={this.props.resourceErrors[index]}
                                                value={resource}
                                                buttonAfter={removeAction}
                                                onChange={this.props.onChangeResourceText} />
                                        );
                                    }, this)
                                }
                                { this.props.resources.length < this.props.maxAllowedResources &&
                                    <div className="form-group">
                                        <div className="col-xs-12">
                                            <Button bsStyle="default" onClick={this.props.onAddResource}>
                                                Add resource
                                            </Button>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>

                    {/*<div className="form-group">
                        <h4>Do you want an image displayed with your market? (optional)</h4>
                        <p>
                            Image files should be no larger than 3MB. Your image will be displayed at a 150px by 150px
                            resolution.
                        </p>
                        { this.props.imageDataURL &&
                            <img className="metadata-image" src={this.props.imageDataURL} />
                        }
                        <Input
                            type="file"
                            id="imageFile"
                            onChange={this.props.onUploadImageFile} />
                    </div>*/}

                    <div className="form-group">
                        <button className="btn btn-primary" type="button" onClick={this.props.goToPreviousStep}>
                            Back
                        </button>
                        <button className="btn btn-primary" type="submit">
                            Next (Trading fee and liquidity)
                        </button>
                    </div>
                </form>
            </div>
        )
    }
});

module.exports = MarketCreateStep2;