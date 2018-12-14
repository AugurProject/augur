import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import ReactHtmlParser from "react-html-parser";
import Styles from "modules/common/components/markdown-renderer/markdown-renderer.styles";

const Remarkable = require("remarkable");

const md = new Remarkable({
  linkify: false,
  breaks: true
});
md.core.ruler.enable([]);
md.block.ruler.enable([]);
md.inline.ruler.enable(["emphasis", "newline"]);
md.inline.ruler.disable(["autolink", "links", "backticks"]);
md.block.ruler.disable([
  "table",
  "footnote",
  "blockquote",
  "code",
  "fences",
  "htmlblock",
  "lheading"
]);

const MarkdownRenderer = ({ text, className, hideLabel }) => {
  if (hideLabel) {
    return (
      <span className={Styles.MarkdownRenderer}>
        {ReactHtmlParser(md.render(text))}
      </span>
    );
  }

  return (
    <label className={classNames(Styles.MarkdownRenderer, className)}>
      {ReactHtmlParser(md.render(text))}
    </label>
  );
};

MarkdownRenderer.propTypes = {
  text: PropTypes.string.isRequired,
  className: PropTypes.string,
  hideLabel: PropTypes.bool
};

MarkdownRenderer.defaultProps = {
  className: null,
  hideLabel: false
};

export default MarkdownRenderer;
