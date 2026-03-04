import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { createElement } from "react-syntax-highlighter";
import { type ReactNode } from "react";
import { useCodeHighlightSlots } from "../hooks/-useCodeHighlightSlots";
import {
  injectAnswerSlotsIntoNode,
  type RendererNode,
} from "../utils/-codeHighlightUtils";

const AnswerSlot = ({
  answerIndex,
  renderAnswerSlot,
}: {
  answerIndex: number;
  renderAnswerSlot: (answerIndex: number) => ReactNode;
}) => {
  return renderAnswerSlot(answerIndex);
};

const CodeHighlight = ({
  code,
  renderAnswerSlot,
}: {
  code: string;
  renderAnswerSlot: (answerIndex: number) => ReactNode;
}) => {
  const { highlightCode, slotTokenToIndex, slotTokenRegex } =
    useCodeHighlightSlots(code);

  const createSlotNode = (answerIndex: number): RendererNode => ({
    type: "element",
    tagName: AnswerSlot,
    properties: {
      className: [],
      answerIndex,
      renderAnswerSlot,
    },
    children: [],
  });

  return (
    <SyntaxHighlighter
      language="python"
      style={vscDarkPlus}
      customStyle={{
        padding: "0",
        margin: "0",
        background: "transparent",
      }}
      codeTagProps={{
        style: {
          fontSize: "1.0rem",
        },
      }}
      renderer={({ rows, stylesheet, useInlineStyles }) =>
        rows.flatMap((row, rowIndex) =>
          injectAnswerSlotsIntoNode(
            row as RendererNode,
            slotTokenRegex,
            slotTokenToIndex,
            createSlotNode
          ).map((transformedNode, transformedNodeIndex) =>
            createElement({
              node: transformedNode,
              stylesheet,
              useInlineStyles,
              key: `code-segment-${rowIndex}-${transformedNodeIndex}`,
            })
          )
        )
      }
    >
      {highlightCode}
    </SyntaxHighlighter>
  );
};

export default CodeHighlight;
