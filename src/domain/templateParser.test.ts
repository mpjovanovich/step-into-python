import { describe, expect, it } from "vitest";
import testTemplate from "./fixtures/test-template.json";
import {
  getStepCount,
  parseTemplate,
  type ParseOptions,
} from "./templateParser";

const testTemplateString = testTemplate.template.join("\n");

describe("step count tests", () => {
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

describe("template parsing tests", () => {
  it("should do something", () => {
    const templateOptions: ParseOptions = {
      title: "TEST TITLE",
      questionTemplate: testTemplateString,
      currentStep: 1,
    };
    const result = parseTemplate(templateOptions);
    expect(result).toBeDefined();
  });
});
