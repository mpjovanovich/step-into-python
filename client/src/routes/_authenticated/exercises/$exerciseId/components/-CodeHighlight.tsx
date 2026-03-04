import { type ReactNode } from "react";
import {
  createElement,
  Prism as SyntaxHighlighter,
} from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useCodeHighlightSlots } from "../hooks/-useCodeHighlightSlots";
import {
  injectAnswerSlotsIntoNode,
  type RendererNode,
} from "../utils/-codeHighlightUtils";

// Mini component:
// Stable component reference so React doesn't unmount/remount slots on parent
// re-renders (which would cause inputs inside slots to lose focus after keypress).
function AnswerSlotRenderer({
  answerIndex,
  renderAnswerSlot,
}: {
  answerIndex: number;
  renderAnswerSlot: (answerIndex: number) => ReactNode;
}) {
  return renderAnswerSlot(answerIndex);
}

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
    tagName: AnswerSlotRenderer, // tagName is the type of the element to render
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
