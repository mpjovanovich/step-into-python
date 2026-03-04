import { type createElementProps } from "react-syntax-highlighter";

/* ---------------------------- */
/* PRIVATE FUNCTIONS */
/* ---------------------------- */

export const escapeRegex = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// This splits a react-syntax-highlighter text node into a list of nodes
export function splitTextNodeWithAnswerSlots(
  node: RendererNode,
  slotTokenRegex: RegExp | null,
  slotTokenToIndex: ReadonlyMap<string, number>,
  createSlotNode: (answerIndex: number) => RendererNode
): RendererNode[] {
  // Quit if the node is not a text node,
  // the value is not a string, or
  // the slot token regex is not provided.
  if (
    node.type !== "text" ||
    typeof node.value !== "string" ||
    !slotTokenRegex
  ) {
    return [node];
  }

  // Quit if there are no placeholder matches.
  const matches = [...node.value.matchAll(slotTokenRegex)];
  if (matches.length === 0) {
    return [node];
  }

  // Fail fast if we don't have the correct number of matches.
  if (matches.length !== slotTokenToIndex.size) {
    throw new Error(
      `Number of matches (${matches.length}) does not match the number of slot tokens (${slotTokenToIndex.size})`
    );
  }

  const result: RendererNode[] = [];
  let previousIndex = 0;

  for (const match of matches) {
    const token = match[0];
    const index = match.index ?? 0;
    const answerIndex = slotTokenToIndex.get(token);

    // Fail fast if we encounter an unknown slot token.
    if (answerIndex === undefined) {
      throw new Error(`Unknown slot token: ${token}`);
    }

    if (index > previousIndex) {
      // Add the text between the previous match and the current match.
      result.push({
        type: "text",
        value: node.value.slice(previousIndex, index),
      });
    }

    // Using a delegate function via injection allows for more flexibility;
    // e.g. it makes testing easier.  That's why we aren't specifying an
    // implementation for createSlotNode.
    result.push(createSlotNode(answerIndex));

    // Move the index to the end of the current match.
    previousIndex = index + token.length;
  }

  if (previousIndex < node.value.length) {
    // Add any remaining text after the last match.
    result.push({
      type: "text",
      value: node.value.slice(previousIndex),
    });
  }

  return result;
}

/* ---------------------------- */
/* PUBLIC FUNCTIONS */
/* ---------------------------- */

export type RendererNode = createElementProps["node"];

// This creates a regex that exactly matches the given slot tokens;
// a logical OR of them
export function buildSlotTokenRegex(slotTokens: string[]): RegExp | null {
  if (slotTokens.length === 0) {
    return null;
  }
  return new RegExp(slotTokens.map(escapeRegex).join("|"), "g");
}

// This is the main entry point for this module.
// Walks the syntax-highlighter node tree and replaces placeholder tokens in
// text with custom “answer slot” nodes.
// Assumes every node is either type: "text" or an element with optional
// children/properties.
export function injectAnswerSlotsIntoNode(
  node: RendererNode,
  slotTokenRegex: RegExp | null,
  slotTokenToIndex: ReadonlyMap<string, number>,
  createSlotNode: (answerIndex: number) => RendererNode
): RendererNode[] {
  // Text nodes need to be split into a list of nodes.
  if (node.type === "text") {
    return splitTextNodeWithAnswerSlots(
      node,
      slotTokenRegex,
      slotTokenToIndex,
      createSlotNode
    );
  }

  // Element nodes with no children do not need to be processed.
  if (!node.children?.length) {
    return [
      {
        ...node,
        properties: node.properties ?? { className: [] },
      },
    ];
  }

  // Recurse into children; any text child may be split by splitTextNodeWithAnswerSlots.
  return [
    {
      ...node,
      properties: node.properties ?? { className: [] },
      children: node.children.flatMap((childNode) =>
        injectAnswerSlotsIntoNode(
          childNode,
          slotTokenRegex,
          slotTokenToIndex,
          createSlotNode
        )
      ),
    },
  ];
}
