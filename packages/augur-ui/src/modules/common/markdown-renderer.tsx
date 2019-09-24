import React from "react";
import classNames from "classnames";

import ReactHtmlParser from "react-html-parser";
import Styles from "modules/common/markdown-renderer.styles.less";

interface MarkdownRenderer {
  text: string;
  className?: string | null;
  hideLabel: Boolean;
}

const Remarkable = require("remarkable");

const md = new Remarkable({
  linkify: false,
  breaks: true,
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
  "lheading",
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

MarkdownRenderer.defaultProps = {
  className: null,
  hideLabel: false,
};

export default MarkdownRenderer;
