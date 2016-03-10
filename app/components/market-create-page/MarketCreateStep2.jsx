let React = require('react');

let Button = require("react-bootstrap/lib/Button");
let Input = require("react-bootstrap/lib/Input");

let MarketCreateStep2 = React.createClass({
    render() {
        return (
            <div>
                <h1>
                    Additional market information
                </h1>

                <form>
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
                        {
                            this.props.tags.map((tag, index) => {
                                return (
                                    <Input
                                        key={index}
                                        data-index={index}
                                        bsStyle={this.props.tagErrors[index] != null ? "error" : null}
                                        help={this.props.tagErrors[index]}
                                        type="text"
                                        value={tag}
                                        onChange={this.props.onChangeTagText} />
                                )
                            }, this)
                        }
                        { this.props.tags.length < 3 &&
                            <Button bsStyle="default" onClick={this.props.onAddTag}>
                                Add tag
                            </Button>
                        }
                    </div>

                    <div className="form-group">
                        <h4>Does your question need further explanation? (optional)</h4>
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
                        {
                            this.props.resources.map((resource, index) => {
                                return (
                                    <Input
                                        key={index}
                                        data-index={index}
                                        type="text"
                                        value={resource}
                                        onChange={this.props.onChangeResourceText} />
                                );
                            }, this)
                        }
                        <Button bsStyle="default" onClick={this.props.onAddResource}>
                            Add resource
                        </Button>
                    </div>

                    <div className="form-group">
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
                    </div>

                    <div className="form-group">
                        <button className="btn btn-primary" type="button" onClick={this.props.goToPreviousStep}>
                            Back
                        </button>
                        <button className="btn btn-primary" type="button" onClick={this.props.goToNextStep}>
                            Next (Trading fee and liquidity)
                        </button>
                    </div>
                </form>
            </div>
        )
    }
});

module.exports = MarketCreateStep2;