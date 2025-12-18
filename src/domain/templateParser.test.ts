import { describe, expect, it } from "vitest";
import { getStepCount } from "./templateParser";

describe("getStepCount", () => {
  it.each([
    {
      description: "single step, single line",
      template: "1?print(99)",
      expected: 1,
    },
    {
      description: "single step, multiple lines",
      template: "1?print(99)\n1?print(99)",
      expected: 1,
    },
    {
      description: "multiple steps",
      template: "1?print(99)\n2?print(99)",
      expected: 2,
    },
  ])("$description", ({ template, expected }) => {
    const result = getStepCount(template);
    expect(result).toEqual(expected);
  });
});
