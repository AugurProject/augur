import React from "react";
import classNames from "classnames";

import ReactHtmlParser from "react-html-parser";
import Styles from "modules/common/markdown-renderer.styles.less";

import { Remarkable } from "remarkable";
import { linkify } from "remarkable/linkify";

const md = new Remarkable({
  breaks: true,
}).use(linkify);
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

interface MarkdownRendererProps {
  text: string;
  className?: string;
  hideLabel?: boolean;
  noPrewrap?: boolean;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ text, className, hideLabel, noPrewrap = false }) => {
  if (hideLabel) {
    return (
      <span className={classNames(Styles.MarkdownRenderer, {
        [Styles.NoPrewrap]: !!noPrewrap,
      })}>
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
