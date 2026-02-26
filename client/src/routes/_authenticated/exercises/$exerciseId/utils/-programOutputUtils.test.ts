import { describe, expect, it } from "vitest";
import { buildHighlightCodeWithSlots } from "./-programOutputUtils";

describe("buildHighlightCodeWithSlots", () => {
  it("returns unchanged code when there are no answer placeholders", () => {
    const code = 'print("Hello, world!")';
    const result = buildHighlightCodeWithSlots(code);

    expect(result.highlightCode).toBe(code);
    expect(result.slotTokens).toEqual([]);
  });

  it("replaces answer placeholders with ordered slot tokens", () => {
    const code = 'print("My name is @@Alf@@. My favorite food is @@pizza@@.")';
    const result = buildHighlightCodeWithSlots(code);

    expect(result.slotTokens).toHaveLength(2);
    expect(result.highlightCode).toBe(
      `print("My name is ${result.slotTokens[0]}. My favorite food is ${result.slotTokens[1]}.")`
    );
  });

  it("uses a unique token prefix if the base prefix appears in code", () => {
    const code = 'print("__STEP_INTO_PYTHON_ANSWER_SLOT_0__ @@test@@")';
    const result = buildHighlightCodeWithSlots(code);

    expect(result.slotTokens).toHaveLength(1);
    expect(result.slotTokens[0]?.startsWith("___STEP_INTO_PYTHON_ANSWER_SLOT_")).toBe(
      true
    );
  });
});
