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
                        <label for="">What is the source of expiry information for your question? (required)</label>

                        <Input
                            value="generic"
                            type="radio"
                            checked={this.props.expirySource === "generic"}
                            label="Outcome will be covered by local, national or international news media."
                            labelClassName="col-sm-10"
                            wrapperClassName="col-sm-12"
                            onChange={this.props.onChangeExpirySource} />
                        <Input
                            value="specific"
                            type="radio"
                            checked={this.props.expirySource === "specific"}
                            label="Outcome will be detailed on a specific website."
                            labelClassName="col-sm-10"
                            wrapperClassName="col-sm-12"
                            onChange={this.props.onChangeExpirySource} />
                        <div className="col-sm-12 indent">
                            <p>Please enter the full URL of the website - which must be publicly available:</p>
                            <Input
                                disabled={this.props.expirySource === "generic"}
                                type="text"
                                value={this.props.expirySourceUrl}
                                placeholder="http://www.boxofficemojo.com"
                                onChange={this.props.onChangeExpirySourceUrl} />
                        </div>
                    </div>

                    <div className="form-group">
                        <h3>
                            Add some tags to your market (required)
                        </h3>
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
                                        help={this.props.tagErrors[index]}
                                        type="text"
                                        value={tag}
                                        onChange={this.props.onChangeTagText} />
                                )
                            }, this)
                        }
                        <Button bsStyle="default" onClick={this.props.onAddTag}>
                            Add tag
                        </Button>
                    </div>

                    <div className="form-group">
                        <p>Does your question need further explanation? (optional)</p>
                        <Input
                            type="textarea"
                            value={this.props.detailsText}
                            placeholder="Optional: enter a more detailed description of your market."
                            onChange={this.props.onChangeDetailsText} />
                    </div>

                    <div className="form-group">
                        <p>Are there any helpful links you want to add? (optional) For example, if your question is about an election you could link to polling information or the webpages of candidates.</p>
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
                        <p>Upload an image to be displayed with your market. (optional) This uploader accepts most common image types (specifically, anything recognized as an image by the HTML5 File API).  A display of your image will be shown below this paragraph.  This is exactly the way the image will look on the market page.  Note: the maximum recommended height for images is 200px; images taller than this will be shrunken to a height of 200px.</p>
                        { this.props.imageDataURL &&
                            <img className="metadata-image" src={this.props.imageDataURL} />
                        }
                        <Input
                            type="file"
                            id="imageFile"
                            onChange={this.props.onUploadImageFile} />
                    </div>

                    <div className="form-group">
                        <button type="button" onClick={this.props.goToPreviousStep}>
                            back
                        </button>
                        <button type="button" onClick={this.props.goToNextStep}>
                            next
                        </button>
                    </div>
                </form>
            </div>
        )
    }
});

module.exports = MarketCreateStep2;