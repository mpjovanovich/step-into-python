import { type ExerciseButtonState } from "@/types/ExerciseButtonState";
import { ExerciseButtonType } from "@/types/ExerciseButtonType";
import { ExerciseStepType } from "@/types/ExerciseStepType";
import { describe, expect, it } from "vitest";
import { getButtonStates } from "./-buttonStateUtils";

function unwrapButtons(buttons: Map<ExerciseButtonType, ExerciseButtonState>) {
  const [previous, next, submit] = [
    buttons.get(ExerciseButtonType.PREVIOUS)!,
    buttons.get(ExerciseButtonType.NEXT)!,
    buttons.get(ExerciseButtonType.SUBMIT)!,
  ];
  return { previous, next, submit };
}

describe("navigation buttons", () => {
  it("creates all buttons in the correct order", () => {
    const buttons = getButtonStates(ExerciseStepType.EXERCISE, true);
    expect(buttons.size).toBe(3);
    expect(Array.from(buttons.keys())).toEqual([
      ExerciseButtonType.PREVIOUS,
      ExerciseButtonType.NEXT,
      ExerciseButtonType.SUBMIT,
    ]);
  });

  describe("visible, enabled, and focus states:", () => {
    it("on start step: previous = visible disabled, next = visible enabled, submit = invisible", () => {
      const buttons = getButtonStates(ExerciseStepType.START, true);

      const { previous, next, submit } = unwrapButtons(buttons);
      expect(previous.visible).toBe(true);
      expect(previous.enabled).toBe(false);
      expect(previous.hasFocus).toBe(false);
      expect(next.visible).toBe(true);
      expect(next.enabled).toBe(true);
      expect(next.hasFocus).toBe(true);
      expect(submit.visible).toBe(false);
      expect(submit.enabled).toBe(false);
      expect(submit.hasFocus).toBe(false);
    });

    it("on template step, no answers required for step: previous = visible enabled, next = visible enabled, submit = invisible", () => {
      const buttons = getButtonStates(ExerciseStepType.EXERCISE, true);

      const { previous, next, submit } = unwrapButtons(buttons);
      expect(previous.visible).toBe(true);
      expect(previous.enabled).toBe(true);
      expect(previous.hasFocus).toBe(false);
      expect(next.visible).toBe(true);
      expect(next.enabled).toBe(true);
      expect(next.hasFocus).toBe(true);
      expect(submit.visible).toBe(false);
      expect(submit.enabled).toBe(false);
      expect(submit.hasFocus).toBe(false);
    });

    it("on template step, all correct answers: previous = visible enabled, next = visible enabled, submit = invisible", () => {
      const buttons = getButtonStates(ExerciseStepType.EXERCISE, true);

      const { previous, next, submit } = unwrapButtons(buttons);
      expect(previous.visible).toBe(true);
      expect(previous.enabled).toBe(true);
      expect(previous.hasFocus).toBe(false);
      expect(next.visible).toBe(true);
      expect(next.enabled).toBe(true);
      expect(next.hasFocus).toBe(true);
      expect(submit.visible).toBe(false);
      expect(submit.enabled).toBe(false);
      expect(submit.hasFocus).toBe(false);
    });

    it("on template step, contains incorrect answers: previous = visible enabled, next = visible disabled, submit = invisible", () => {
      const buttons = getButtonStates(ExerciseStepType.EXERCISE, false);

      const { previous, next, submit } = unwrapButtons(buttons);
      expect(previous.visible).toBe(true);
      expect(previous.enabled).toBe(true);
      expect(previous.hasFocus).toBe(false);
      expect(next.visible).toBe(true);
      expect(next.enabled).toBe(false);
      expect(next.hasFocus).toBe(false);
      expect(submit.visible).toBe(false);
      expect(submit.enabled).toBe(false);
      expect(submit.hasFocus).toBe(false);
    });

    it("on submit step: previous = visible enabled, next = invisible, submit = visible enabled", () => {
      const buttons = getButtonStates(ExerciseStepType.SUBMIT, true);

      const { previous, next, submit } = unwrapButtons(buttons);
      expect(previous.visible).toBe(true);
      expect(previous.enabled).toBe(true);
      expect(previous.hasFocus).toBe(false);
      expect(next.visible).toBe(false);
      expect(next.enabled).toBe(false);
      expect(next.hasFocus).toBe(false);
      expect(submit.visible).toBe(true);
      expect(submit.enabled).toBe(true);
      expect(submit.hasFocus).toBe(true);
    });
  });
});
