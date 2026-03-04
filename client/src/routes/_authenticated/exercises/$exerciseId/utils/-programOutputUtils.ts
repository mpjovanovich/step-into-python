import { BLANK_REGEX } from "@/constants";

// Answers within a template are mared as "@@answer@@";
// delineated by double @@.
// This prefix is used to identify the answer slots in the template.
const ANSWER_SLOT_TOKEN_PREFIX = "__TOKEN_PREFIX";

export interface HighlightCodeWithSlots {
  highlightCode: string;
  slotTokens: string[];
}

export const buildHighlightCodeWithSlots = (
  template: string
): HighlightCodeWithSlots => {
  const slotTokens: string[] = [];
  const highlightCode = template.replace(BLANK_REGEX, () => {
    const token = `${ANSWER_SLOT_TOKEN_PREFIX}${slotTokens.length}__`;
    slotTokens.push(token);
    return token;
  });

  return {
    highlightCode,
    slotTokens,
  };
};
