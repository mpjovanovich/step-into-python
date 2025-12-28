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

describe("generates correct code lines for given step", () => {
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

describe("generates correct copy code", () => {
  const makeOptions = (template: string[], step: number): ParseOptions => ({
    title: "TEST TITLE",
    questionTemplate: template,
    currentStep: step,
  });

  const TEMPLATE = ["1?one @@+@@ two"];

  it("does not include @@ markers in copy code", () => {
    const templateOptions = makeOptions(TEMPLATE, 1);
    const result = parseTemplate(templateOptions);
    expect(result.copyCode).not.toContain("@@");
  });

  it("does not include answers in copy code", () => {
    const templateOptions = makeOptions(TEMPLATE, 1);
    const result = parseTemplate(templateOptions);
    expect(result.copyCode).not.toContain("+");
  });
});

describe("generates correct answers array for given step", () => {
  const makeOptions = (template: string[], step: number): ParseOptions => ({
    title: "TEST TITLE",
    questionTemplate: template,
    currentStep: step,
  });

  const TEMPLATE = [
    "1?one", // no answer
    "2?@@two@@", // answer at start of step
    "3?test @@three@@", // answer not at start of step
    "4?test @@four1@@ @@four2@@", // multiple answers in one line
    "5?test @@five1@@", // multiple answers across multiple lines
    "5?test @@five2@@", // multiple answers across multiple lines
  ];

  it("step has no answers", () => {
    const templateOptions = makeOptions(TEMPLATE, 1);
    const result = parseTemplate(templateOptions);
    expect(result.answers).toEqual([]);
  });

  it("step has answer at start of step", () => {
    const templateOptions = makeOptions(TEMPLATE, 2);
    const result = parseTemplate(templateOptions);
    expect(result.answers).toEqual(["two"]);
  });

  it("step has answer not at start of step", () => {
    const templateOptions = makeOptions(TEMPLATE, 3);
    const result = parseTemplate(templateOptions);
    expect(result.answers).toEqual(["three"]);
  });

  it("step has multiple answers in one line", () => {
    const templateOptions = makeOptions(TEMPLATE, 4);
    const result = parseTemplate(templateOptions);
    expect(result.answers).toEqual(["four1", "four2"]);
  });

  it("step has multiple answers across multiple lines", () => {
    const templateOptions = makeOptions(TEMPLATE, 5);
    const result = parseTemplate(templateOptions);
    expect(result.answers).toEqual(["five1", "five2"]);
  });
});
