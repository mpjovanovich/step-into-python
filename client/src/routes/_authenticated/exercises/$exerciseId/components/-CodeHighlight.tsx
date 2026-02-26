import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  createElement,
  type createElementProps,
} from "react-syntax-highlighter";
import { type ReactNode, useMemo } from "react";
import { buildHighlightCodeWithSlots } from "../utils/-programOutputUtils";

type RendererNode = createElementProps["node"];

const escapeRegex = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const AnswerSlot = ({
  answerIndex,
  renderAnswerSlot,
}: {
  answerIndex: number;
  renderAnswerSlot: (answerIndex: number) => ReactNode;
}) => {
  return renderAnswerSlot(answerIndex);
};

function splitTextNodeWithAnswerSlots(
  node: RendererNode,
  slotTokenRegex: RegExp | null,
  slotTokenToIndex: ReadonlyMap<string, number>,
  renderAnswerSlot: (answerIndex: number) => ReactNode
): RendererNode[] {
  if (node.type !== "text" || typeof node.value !== "string" || !slotTokenRegex) {
    return [node];
  }

  const matches = [...node.value.matchAll(slotTokenRegex)];
  if (matches.length === 0) {
    return [node];
  }

  const result: RendererNode[] = [];
  let previousIndex = 0;

  for (const match of matches) {
    const token = match[0];
    const index = match.index ?? 0;
    const answerIndex = slotTokenToIndex.get(token);

    if (index > previousIndex) {
      result.push({
        type: "text",
        value: node.value.slice(previousIndex, index),
      });
    }

    if (answerIndex === undefined) {
      result.push({
        type: "text",
        value: token,
      });
    } else {
      result.push({
        type: "element",
        tagName: AnswerSlot,
        properties: {
          className: [],
          answerIndex,
          renderAnswerSlot,
        },
        children: [],
      });
    }

    previousIndex = index + token.length;
  }

  if (previousIndex < node.value.length) {
    result.push({
      type: "text",
      value: node.value.slice(previousIndex),
    });
  }

  return result;
}

function injectAnswerSlotsIntoNode(
  node: RendererNode,
  slotTokenRegex: RegExp | null,
  slotTokenToIndex: ReadonlyMap<string, number>,
  renderAnswerSlot: (answerIndex: number) => ReactNode
): RendererNode[] {
  if (node.type === "text") {
    return splitTextNodeWithAnswerSlots(
      node,
      slotTokenRegex,
      slotTokenToIndex,
      renderAnswerSlot
    );
  }

  if (!node.children?.length) {
    return [
      {
        ...node,
        properties: node.properties ?? { className: [] },
      },
    ];
  }

  return [
    {
      ...node,
      properties: node.properties ?? { className: [] },
      children: node.children.flatMap((childNode) =>
        injectAnswerSlotsIntoNode(
          childNode,
          slotTokenRegex,
          slotTokenToIndex,
          renderAnswerSlot
        )
      ),
    },
  ];
}

const CodeHighlight = ({
  code,
  renderAnswerSlot,
}: {
  code: string;
  renderAnswerSlot: (answerIndex: number) => ReactNode;
}) => {
  const { highlightCode, slotTokens } = useMemo(
    () => buildHighlightCodeWithSlots(code),
    [code]
  );
  const slotTokenToIndex = useMemo(
    () => new Map(slotTokens.map((token, index) => [token, index])),
    [slotTokens]
  );
  const slotTokenRegex = useMemo(() => {
    if (slotTokens.length === 0) {
      return null;
    }

    return new RegExp(slotTokens.map(escapeRegex).join("|"), "g");
  }, [slotTokens]);

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
            renderAnswerSlot
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
