import { describe, expect, it, vi } from "vitest";
import { StepType } from "../../../types/StepType";
import { useNavigationButtons, type ButtonState } from "./useNavigationButtons";

// Helper function to get the three buttons by text
function getButtonsByText(buttons: ButtonState[]): {
  previous: ButtonState;
  next: ButtonState;
  submit: ButtonState;
} {
  return {
    previous: buttons.find((button) => button.text === "Previous")!,
    next: buttons.find((button) => button.text === "Next")!,
    submit: buttons.find((button) => button.text === "Submit")!,
  };
}

describe("navigation buttons", () => {
  it("creates all buttons in the correct order with correct text", () => {
    const { buttons } = useNavigationButtons({
      stepType: StepType.EXERCISE,
      checkAnswerResults: [],
      onPrevious: () => {},
      onNext: () => {},
      onSubmit: () => {},
    });
    expect(buttons.length).toBe(3);
    expect(buttons[0].text).toBe("Previous");
    expect(buttons[1].text).toBe("Next");
    expect(buttons[2].text).toBe("Submit");
  });

  it("wires up click handlers for buttons", () => {
    const onPrevious = vi.fn();
    const onNext = vi.fn();
    const onSubmit = vi.fn();

    const { buttons } = useNavigationButtons({
      stepType: StepType.EXERCISE,
      checkAnswerResults: [],
      onPrevious,
      onNext,
      onSubmit,
    });

    const { previous, next, submit } = getButtonsByText(buttons);
    previous.onClick();
    expect(onPrevious).toHaveBeenCalled();

    // Get "next" button
    next.onClick();
    expect(onNext).toHaveBeenCalled();

    // Get "submit" button
    submit.onClick();
    expect(onSubmit).toHaveBeenCalled();
  });

  /* ********************************************************
   * STEP DETAILS
   ******************************************************** */
  // We always have three "artificial" steps no matter how many steps are in the
  // template.  E.g.: In a template with three steps, the following steps are
  // expected:

  // Step 0: Artificial - "start screen" with basic instructions.
  // Step 1: Template - First step
  // Step 2: Template - Second step
  // Step 3: Template - Third (final) step
  // Step 4: Artificial - Submit button after completing all steps.
  // Step 5: Artificial - Complete screen with link to home.

  // Note that "finalStep" is the final step number from the template, so in
  // this case it would be 3.

  describe("visible and enabled states:", () => {
    it("on start step: previous = visible disabled, next = visible enabled, submit = invisible", () => {
      const { buttons } = useNavigationButtons({
        stepType: StepType.START,
        checkAnswerResults: [true],
        onPrevious: () => {},
        onNext: () => {},
        onSubmit: () => {},
      });

      const { previous, next, submit } = getButtonsByText(buttons);
      expect(previous.visible).toBe(true);
      expect(previous.enabled).toBe(false);
      expect(next.visible).toBe(true);
      expect(next.enabled).toBe(true);
      expect(submit.visible).toBe(false);
    });

    it("on template step, no answers required for step: previous = visible enabled, next = visible enabled, submit = invisible", () => {
      const { buttons } = useNavigationButtons({
        stepType: StepType.EXERCISE,
        checkAnswerResults: [],
        onPrevious: () => {},
        onNext: () => {},
        onSubmit: () => {},
      });

      const { previous, next, submit } = getButtonsByText(buttons);
      expect(previous.visible).toBe(true);
      expect(previous.enabled).toBe(true);
      expect(next.visible).toBe(true);
      expect(next.enabled).toBe(true);
      expect(submit.visible).toBe(false);
    });

    it("on template step, all correct answers: previous = visible enabled, next = visible enabled, submit = invisible", () => {
      const { buttons } = useNavigationButtons({
        stepType: StepType.EXERCISE,
        checkAnswerResults: [true],
        onPrevious: () => {},
        onNext: () => {},
        onSubmit: () => {},
      });

      const { previous, next, submit } = getButtonsByText(buttons);
      expect(previous.visible).toBe(true);
      expect(previous.enabled).toBe(true);
      expect(next.visible).toBe(true);
      expect(next.enabled).toBe(true);
      expect(submit.visible).toBe(false);
    });

    it("on template step, contains incorrect answers: previous = visible enabled, next = visible disabled, submit = invisible", () => {
      const { buttons } = useNavigationButtons({
        stepType: StepType.EXERCISE,
        checkAnswerResults: [false],
        onPrevious: () => {},
        onNext: () => {},
        onSubmit: () => {},
      });

      const { previous, next, submit } = getButtonsByText(buttons);
      expect(previous.visible).toBe(true);
      expect(previous.enabled).toBe(true);
      expect(next.visible).toBe(true);
      expect(next.enabled).toBe(false);
      expect(submit.visible).toBe(false);
    });

    it("on submit step: previous = visible enabled, next = invisible, submit = visible enabled", () => {
      const { buttons } = useNavigationButtons({
        stepType: StepType.SUBMIT,
        checkAnswerResults: [],
        onPrevious: () => {},
        onNext: () => {},
        onSubmit: () => {},
      });

      const { previous, next, submit } = getButtonsByText(buttons);
      expect(previous.visible).toBe(true);
      expect(previous.enabled).toBe(true);
      expect(next.visible).toBe(false);
      expect(submit.visible).toBe(true);
      expect(submit.enabled).toBe(true);
    });

    it("on complete step: previous = visible disabled, next = invisible, submit = invisible", () => {
      const { buttons } = useNavigationButtons({
        stepType: StepType.COMPLETE,
        checkAnswerResults: [],
        onPrevious: () => {},
        onNext: () => {},
        onSubmit: () => {},
      });

      const { previous, next, submit } = getButtonsByText(buttons);
      expect(previous.visible).toBe(true);
      expect(previous.enabled).toBe(false);
      expect(next.visible).toBe(false);
      expect(submit.visible).toBe(false);
    });
  });

  describe("exercise complete state:", () => {
    it("on start step: exercise complete = false", () => {
      const { exerciseComplete } = useNavigationButtons({
        stepType: StepType.START,
        checkAnswerResults: [],
        onPrevious: () => {},
        onNext: () => {},
        onSubmit: () => {},
      });
      expect(exerciseComplete).toBe(false);
    });

    it("on template step: exercise complete = false", () => {
      const { exerciseComplete } = useNavigationButtons({
        stepType: StepType.EXERCISE,
        checkAnswerResults: [],
        onPrevious: () => {},
        onNext: () => {},
        onSubmit: () => {},
      });
      expect(exerciseComplete).toBe(false);
    });

    it("on submit step: exercise complete = false", () => {
      const { exerciseComplete } = useNavigationButtons({
        stepType: StepType.SUBMIT,
        checkAnswerResults: [],
        onPrevious: () => {},
        onNext: () => {},
        onSubmit: () => {},
      });
      expect(exerciseComplete).toBe(false);
    });

    it("on complete step: exercise complete = true", () => {
      const { exerciseComplete } = useNavigationButtons({
        stepType: StepType.COMPLETE,
        checkAnswerResults: [],
        onPrevious: () => {},
        onNext: () => {},
        onSubmit: () => {},
      });
      expect(exerciseComplete).toBe(true);
    });
  });
});
