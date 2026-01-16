import {
  getCodeForStep,
  getStepCount,
  type CodeForStep,
  type CodeParseOptions,
} from "@/domain/templateParser";

describe("generates correct step count", () => {
  it("single step, single line", () => {
    const result = getStepCount(["1?"]);
    expect(result).toEqual(1);
  });

  it("single step, multiple lines", () => {
    const result = getStepCount(["1?", "1?"]);
    expect(result).toEqual(1);
  });

  it("multiple steps", () => {
    const result = getStepCount(["1?", "2?"]);
    expect(result).toEqual(2);
  });

  it("multiple steps, explicit end step", () => {
    const result = getStepCount(["1:1?", "2:2?"]);
    expect(result).toEqual(2);
  });
});

it("generates title comment in code", () => {
  const templateOptions: CodeParseOptions = {
    title: "TEST TITLE",
    questionTemplate: [],
    currentStep: 1,
  };
  const result = getCodeForStep(templateOptions);
  expect(result.code).toEqual(`## EXERCISE: ${templateOptions.title}\n`);
});

describe("generates correct code lines", () => {
  const makeOptions = (template: string[], step: number): CodeParseOptions => ({
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
    const result = getCodeForStep(templateOptions);
    expect(result.code).toContain("one\n");
    expect(result.code).not.toContain("two\n");
    expect(result.code).not.toContain("three\n");
  });

  it("correctly uses start step when line has step range", () => {
    const templateOptions = makeOptions(TEMPLATE, 2);
    const result = getCodeForStep(templateOptions);
    expect(result.code).toContain("one\n");
    expect(result.code).toContain("two\n");
    expect(result.code).not.toContain("three\n");
  });

  it("correctly uses end step when line has step range", () => {
    const templateOptions = makeOptions(TEMPLATE, 3);
    const result = getCodeForStep(templateOptions);
    expect(result.code).toContain("one\n");
    expect(result.code).not.toContain("two\n");
    expect(result.code).toContain("three\n");
  });
});

describe("generates correct copy code", () => {
  const makeOptions = (template: string[], step: number): CodeParseOptions => ({
    title: "TEST TITLE",
    questionTemplate: template,
    currentStep: step,
  });

  const TEMPLATE = ["1?one @@+@@ two"];
  let result: CodeForStep;

  beforeAll(() => {
    const templateOptions = makeOptions(TEMPLATE, 1);
    result = getCodeForStep(templateOptions);
  });

  it("includes non-answer text in copy code", () => {
    expect(result.copyCode).toContain("one ");
    expect(result.copyCode).toContain(" two\n");
  });

  it("does not include @@ markers in copy code", () => {
    expect(result.copyCode).not.toContain("@@");
  });

  it("does not include answers in copy code", () => {
    expect(result.copyCode).not.toContain("+");
  });
});

describe("generates correct answers array for given step", () => {
  const makeOptions = (template: string[], step: number): CodeParseOptions => ({
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
    const result = getCodeForStep(templateOptions);
    expect(result.answers).toEqual([]);
  });

  it("step has answer at start of step", () => {
    const templateOptions = makeOptions(TEMPLATE, 2);
    const result = getCodeForStep(templateOptions);
    expect(result.answers).toEqual(["two"]);
  });

  it("step has answer not at start of step", () => {
    const templateOptions = makeOptions(TEMPLATE, 3);
    const result = getCodeForStep(templateOptions);
    expect(result.answers).toEqual(["three"]);
  });

  it("step has multiple answers in one line", () => {
    const templateOptions = makeOptions(TEMPLATE, 4);
    const result = getCodeForStep(templateOptions);
    expect(result.answers).toEqual(["four1", "four2"]);
  });

  it("step has multiple answers across multiple lines", () => {
    const templateOptions = makeOptions(TEMPLATE, 5);
    const result = getCodeForStep(templateOptions);
    expect(result.answers).toEqual(["five1", "five2"]);
  });
});
