import { describe, expect, it, vi } from "vitest";
import { useNavigationButtons } from "./useNavigationButtons";

describe("navigation buttons", () => {
  it("creates all three buttons with correct text", () => {
    const { buttons } = useNavigationButtons({
      step: 1,
      finalStep: 1,
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
      step: 1,
      finalStep: 1,
      checkAnswerResults: [],
      onPrevious,
      onNext,
      onSubmit,
    });

    // Get "previous" button
    const previousButton = buttons.find((button) => button.text === "Previous");
    previousButton?.onClick();
    expect(onPrevious).toHaveBeenCalled();

    // Get "next" button
    const nextButton = buttons.find((button) => button.text === "Next");
    nextButton?.onClick();
    expect(onNext).toHaveBeenCalled();

    // Get "submit" button
    const submitButton = buttons.find((button) => button.text === "Submit");
    submitButton?.onClick();
    expect(onSubmit).toHaveBeenCalled();
  });

  // TODO: enabled state testing

  // TODO: visible state testing
});
