import { allCorrect, checkAnswers } from "@/domain/answerChecker";
import { describe, expect, it } from "vitest";

describe("checks user answers", () => {
  it("gives null result for unanswered answer", () => {
    const results = checkAnswers([""], ["correct"]);
    expect(results).toEqual([null]);
  });

  it("gives false result for incorrect answer", () => {
    const results = checkAnswers(["incorrect"], ["correct"]);
    expect(results).toEqual([false]);
  });

  it("gives true result for correct answer", () => {
    const results = checkAnswers(["correct"], ["correct"]);
    expect(results).toEqual([true]);
  });

  it("ignores whitespace in user answer", () => {
    const results = checkAnswers(["\t correct "], ["correct"]);
    expect(results).toEqual([true]);
  });

  it("returns positionally correct results when there are multiple answers", () => {
    const results = checkAnswers(
      ["", "incorrect", "correct3"],
      ["correct1", "correct2", "correct3"]
    );
    expect(results).toEqual([null, false, true]);
  });
});

describe('"all correct" functionality', () => {
  it("returns true if all answers are correct", () => {
    const results = [true, true];
    expect(allCorrect(results)).toEqual(true);
  });

  it("returns false if contains incorrect answer", () => {
    const results = [true, false];
    expect(allCorrect(results)).toEqual(false);
  });

  it("returns false if contains unanswered answer", () => {
    const results = [true, null];
    expect(allCorrect(results)).toEqual(false);
  });
});
