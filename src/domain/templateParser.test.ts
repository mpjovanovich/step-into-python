import { describe, expect, it } from "vitest";
import {
  getStepCount,
  parseTemplate,
  type ParseOptions,
} from "./templateParser";

describe("generates correct step count", () => {
  const TESTS = [
    {
      description: "single step, single line",
      template: ["1?"],
      expected: 1,
    },
    {
      description: "single step, multiple lines",
      template: ["1?", "1?"],
      expected: 1,
    },
    {
      description: "multiple steps",
      template: ["1?", "2?"],
      expected: 2,
    },
    {
      description: "multiple steps, explicit end step",
      template: ["1:1?", "2:2?"],
      expected: 2,
    },
  ];

  it.each(TESTS)("$description", ({ template, expected }) => {
    const result = getStepCount(template);
    expect(result).toEqual(expected);
  });
});

it("generates title comment in code", () => {
  const templateOptions: ParseOptions = {
    title: "TEST TITLE",
    questionTemplate: [],
    currentStep: 1,
  };
  const result = parseTemplate(templateOptions);
  expect(result.code).toEqual(`## EXERCISE: ${templateOptions.title}\n`);
});

describe("shows code lines correctly for given step", () => {
  const makeOptions = (template: string[], step: number): ParseOptions => ({
    title: "TEST TITLE",
    questionTemplate: template,
    currentStep: step,
  });

  const TEMPLATE = [
    "1?one",
    "2:2?two",
    "3?three", //
  ];

  it("shows code for current step, not subsequent steps", () => {
    const templateOptions = makeOptions(TEMPLATE, 1);
    const result = parseTemplate(templateOptions);
    expect(result.code).toContain("one\n");
    expect(result.code).not.toContain("two\n");
    expect(result.code).not.toContain("three\n");
  });

  it("line with step range correctly use start step", () => {
    const templateOptions = makeOptions(TEMPLATE, 2);
    const result = parseTemplate(templateOptions);
    expect(result.code).toContain("one\n");
    expect(result.code).toContain("two\n");
    expect(result.code).not.toContain("three\n");
  });

  it("line with step range correctly use end step", () => {
    const templateOptions = makeOptions(TEMPLATE, 3);
    const result = parseTemplate(templateOptions);
    expect(result.code).toContain("one\n");
    expect(result.code).not.toContain("two\n");
    expect(result.code).toContain("three\n");
  });
});
