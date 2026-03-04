import { describe, expect, it } from "vitest";
import {
  buildSlotTokenRegex,
  injectAnswerSlotsIntoNode,
  type RendererNode,
} from "./-codeHighlightUtils";

const createSlotNode = (answerIndex: number): RendererNode => ({
  type: "element",
  tagName: "span",
  properties: { className: [], slotIndex: answerIndex },
  children: [],
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

describe("injectAnswerSlotsIntoNode", () => {
  it("returns text node unchanged when it contains no slot tokens", () => {
    const node: RendererNode = { type: "text", value: "plain code" };
    const regex = buildSlotTokenRegex(["__SLOT0__"]);
    const map = new Map([["__SLOT0__", 0]]);
    const result = injectAnswerSlotsIntoNode(node, regex, map, createSlotNode);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(node);
  });

  it("returns text node unchanged when regex is null", () => {
    const node: RendererNode = { type: "text", value: "hello" };
    const result = injectAnswerSlotsIntoNode(
      node,
      null,
      new Map([["__SLOT0__", 0]]),
      createSlotNode
    );
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(node);
  });

  it("splits text on one slot token and inserts slot node", () => {
    const node: RendererNode = { type: "text", value: "x __SLOT0__ y" };
    const regex = buildSlotTokenRegex(["__SLOT0__"]);
    const map = new Map([["__SLOT0__", 0]]);
    const result = injectAnswerSlotsIntoNode(node, regex, map, createSlotNode);
    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({ type: "text", value: "x " });
    expect(result[1]).toEqual(createSlotNode(0));
    expect(result[2]).toEqual({ type: "text", value: " y" });
  });

  it("splits text on multiple slot tokens and inserts slot nodes in order", () => {
    const node: RendererNode = {
      type: "text",
      value: "a __SLOT0__ b __SLOT1__ c",
    };
    const regex = buildSlotTokenRegex(["__SLOT0__", "__SLOT1__"]);
    const map = new Map([
      ["__SLOT0__", 0],
      ["__SLOT1__", 1],
    ]);
    const result = injectAnswerSlotsIntoNode(node, regex, map, createSlotNode);
    expect(result).toHaveLength(5);
    expect(result[0]).toEqual({ type: "text", value: "a " });
    expect(result[1]).toEqual(createSlotNode(0));
    expect(result[2]).toEqual({ type: "text", value: " b " });
    expect(result[3]).toEqual(createSlotNode(1));
    expect(result[4]).toEqual({ type: "text", value: " c" });
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

  it("recursively injects slots into child text nodes", () => {
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

  it("allows each text node to contain a subset of slot tokens (e.g. when syntax highlighter splits one line into multiple nodes)", () => {
    // Simulates one row tokenized into separate text nodes: first node has only
    // __SLOT0__, second has only __SLOT1__. The step has 2 slots total, but we
    // process each node independently, so we must not require matches.length ===
    // slotTokenToIndex.size per node.
    const node: RendererNode = {
      type: "element",
      tagName: "span",
      properties: { className: [] },
      children: [
        { type: "text", value: 'prefix + __SLOT0__ + "' },
        { type: "text", value: ". " },
        { type: "text", value: " + __SLOT1__ + " },
        { type: "text", value: '".' },
      ],
    };
    const regex = buildSlotTokenRegex(["__SLOT0__", "__SLOT1__"]);
    const map = new Map([
      ["__SLOT0__", 0],
      ["__SLOT1__", 1],
    ]);
    const result = injectAnswerSlotsIntoNode(node, regex, map, createSlotNode);
    expect(result).toHaveLength(1);
    const element = result[0];
    expect(element.type).toBe("element");
    if (element.type === "element") {
      expect(element.children).toHaveLength(8);
      expect(element.children![0]).toEqual({
        type: "text",
        value: 'prefix + ',
      });
      expect(element.children![1]).toEqual(createSlotNode(0));
      expect(element.children![2]).toEqual({ type: "text", value: ' + "' });
      expect(element.children![3]).toEqual({ type: "text", value: ". " });
      expect(element.children![4]).toEqual({ type: "text", value: " + " });
      expect(element.children![5]).toEqual(createSlotNode(1));
      expect(element.children![6]).toEqual({ type: "text", value: " + " });
      expect(element.children![7]).toEqual({ type: "text", value: '".' });
    }
  });

  it("throws when text contains a slot token not in the map", () => {
    const node: RendererNode = {
      type: "text",
      value: "a __SLOT0__ __UNKNOWN__",
    };
    const regex = buildSlotTokenRegex(["__SLOT0__", "__UNKNOWN__"]);
    const map = new Map([
      ["__SLOT0__", 0],
      ["__SLOT1__", 1],
    ]);

    expect(() =>
      injectAnswerSlotsIntoNode(node, regex, map, createSlotNode)
    ).toThrow(/Unknown slot token: .*/);
  });
});
