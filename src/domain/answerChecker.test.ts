import { describe, expect, it } from "vitest";
import { allCorrect, checkAnswers } from "./answerChecker";

describe("checks user answers", () => {
  it("unanswered gives null result", () => {
    const results = checkAnswers([""], ["correct"]);
    expect(results).toEqual([null]);
  });

  it("incorrect gives false result", () => {
    const results = checkAnswers(["incorrect"], ["correct"]);
    expect(results).toEqual([false]);
  });

  it("correct gives true result", () => {
    const results = checkAnswers(["correct"], ["correct"]);
    expect(results).toEqual([true]);
  });

  it("whitespace is ignored in user answer", () => {
    const results = checkAnswers(["\t correct "], ["correct"]);
    expect(results).toEqual([true]);
  });

  it("returned results are positionally correct with multiple answers", () => {
    const results = checkAnswers(
      ["", "incorrect", "correct3"],
      ["correct1", "correct2", "correct3"]
    );
    expect(results).toEqual([null, false, true]);
  });
});

describe("all correct functionality", () => {
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
