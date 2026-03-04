import { describe, expect, it } from "vitest";
import {
  buildSlotTokenRegex,
  escapeRegex,
  injectAnswerSlotsIntoNode,
  splitTextNodeWithAnswerSlots,
  type RendererNode,
} from "./-codeHighlightUtils";

// Helper function for creating a node.
const createSlotNode = (answerIndex: number): RendererNode => ({
  type: "element",
  tagName: "span",
  properties: { className: [], slotIndex: answerIndex },
  children: [],
});

describe("escapeRegex", () => {
  it("escapes special regex characters", () => {
    expect(escapeRegex(".*+?^${}()|[]\\")).toBe(
      "\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\"
    );
  });

  it("returns plain string unchanged when no special chars", () => {
    expect(escapeRegex("hello")).toBe("hello");
  });
});

describe("buildSlotTokenRegex", () => {
  it("returns null for empty slot tokens", () => {
    expect(buildSlotTokenRegex([])).toBeNull();
  });

  it("returns a global regex that matches slot tokens", () => {
    const tokens = ["__TOKEN_PREFIX0__", "__TOKEN_PREFIX1__"];
    const regex = buildSlotTokenRegex(tokens);
    expect(regex).not.toBeNull();
    const result = "a__TOKEN_PREFIX0__b__TOKEN_PREFIX1__c".match(regex!);
    expect(result).toHaveLength(tokens.length);
    expect(result?.[0]).toBe(tokens[0]);
    expect(result?.[1]).toBe(tokens[1]);
  });

  it("escapes tokens so special characters do not break the regex", () => {
    const regex = buildSlotTokenRegex(["a.b"]);
    expect(regex).not.toBeNull();
    const result = "x a.b y".match(regex!);
    expect(result).toHaveLength(1);
    expect(result?.[0]).toBe("a.b");
  });
});

describe("splitTextNodeWithAnswerSlots", () => {
  const slotRegex = buildSlotTokenRegex(["__SLOT0__", "__SLOT1__"]);
  const slotMap = new Map([
    ["__SLOT0__", 0],
    ["__SLOT1__", 1],
  ]);

  it("leaves nodes unchanged when they contain no slot tokens to replace", () => {
    const elementNode: RendererNode = {
      type: "element",
      tagName: "span",
      properties: { className: [] },
      children: [],
    };
    let result = splitTextNodeWithAnswerSlots(
      elementNode,
      slotRegex,
      slotMap,
      createSlotNode
    );
    expect(result).toEqual([elementNode]);

    const textNoSlots: RendererNode = {
      type: "text",
      value: "plain code",
    };
    result = splitTextNodeWithAnswerSlots(
      textNoSlots,
      slotRegex,
      slotMap,
      createSlotNode
    );
    expect(result).toEqual([textNoSlots]);

    const textWithNullRegex: RendererNode = {
      type: "text",
      value: "hello",
    };
    result = splitTextNodeWithAnswerSlots(
      textWithNullRegex,
      slotRegex,
      slotMap,
      createSlotNode
    );
    expect(result).toEqual([textWithNullRegex]);
  });

  it("splits text on slot tokens and inserts slot nodes in order", () => {
    const node: RendererNode = {
      type: "text",
      value: "a __SLOT0__ b __SLOT1__ c",
    };

    const result = splitTextNodeWithAnswerSlots(
      node,
      slotRegex,
      slotMap,
      createSlotNode
    );

    expect(result).toHaveLength(5);
    expect(result[0]).toEqual({ type: "text", value: "a " });
    expect(result[1]).toEqual(createSlotNode(0));
    expect(result[2]).toEqual({ type: "text", value: " b " });
    expect(result[3]).toEqual(createSlotNode(1));
    expect(result[4]).toEqual({ type: "text", value: " c" });
  });

  it("throws error when number of matches does not match the number of slot tokens", () => {
    const node: RendererNode = {
      type: "text",
      value: "a __SLOT0__ __UNKNOWN__",
    };
    const map = new Map([["__SLOT0__", 0]]);
    const regex = buildSlotTokenRegex(["__SLOT0__", "__UNKNOWN__"]);

    expect(() =>
      splitTextNodeWithAnswerSlots(node, regex, map, createSlotNode)
    ).toThrow(
      /Number of matches .* does not match the number of slot tokens .*/
    );
  });

  it("throws error when text contains a slot token not in the map", () => {
    const node: RendererNode = {
      type: "text",
      value: "a __SLOT0__ __UNKNOWN__",
    };
    const regex = buildSlotTokenRegex(["__SLOT0__", "__UNKNOWN__"]);

    expect(() =>
      splitTextNodeWithAnswerSlots(node, regex, slotMap, createSlotNode)
    ).toThrow(/Unknown slot token: .*/);
  });
});

// Integration of previous tests.
describe("injectAnswerSlotsIntoNode", () => {
  it("delegates text nodes to splitTextNodeWithAnswerSlots", () => {
    const node: RendererNode = { type: "text", value: "x __SLOT0__ y" };
    const regex = buildSlotTokenRegex(["__SLOT0__"]);
    const map = new Map([["__SLOT0__", 0]]);
    const result = injectAnswerSlotsIntoNode(node, regex, map, createSlotNode);
    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({ type: "text", value: "x " });
    expect(result[1]).toEqual(createSlotNode(0));
    expect(result[2]).toEqual({ type: "text", value: " y" });
  });

  it("preserves element node without children", () => {
    const node: RendererNode = {
      type: "element",
      tagName: "span",
      properties: { className: ["x"] },
      children: [],
    };
    const regex = buildSlotTokenRegex(["__SLOT0__"]);
    const map = new Map([["__SLOT0__", 0]]);
    const result = injectAnswerSlotsIntoNode(node, regex, map, createSlotNode);
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      type: "element",
      tagName: "span",
      properties: { className: ["x"] },
      children: [],
    });
  });

  it("recursively injects slots into child nodes", () => {
    const node: RendererNode = {
      type: "element",
      tagName: "span",
      properties: { className: [] },
      children: [{ type: "text", value: "before __SLOT0__ after" }],
    };
    const regex = buildSlotTokenRegex(["__SLOT0__"]);
    const map = new Map([["__SLOT0__", 0]]);
    const result = injectAnswerSlotsIntoNode(node, regex, map, createSlotNode);
    expect(result).toHaveLength(1);
    const element = result[0];
    expect(element.type).toBe("element");
    if (element.type === "element") {
      expect(element.children).toHaveLength(3);
      expect(element.children![0]).toEqual({ type: "text", value: "before " });
      expect(element.children![1]).toEqual(createSlotNode(0));
      expect(element.children![2]).toEqual({ type: "text", value: " after" });
    }
  });
});
