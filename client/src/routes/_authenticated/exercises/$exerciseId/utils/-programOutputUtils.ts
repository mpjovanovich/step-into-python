import { BLANK_REGEX } from "@/constants";

const ANSWER_SLOT_TOKEN_PREFIX = "__STEP_INTO_PYTHON_ANSWER_SLOT_";

export interface HighlightCodeWithSlots {
  highlightCode: string;
  slotTokens: string[];
}

function getUniqueSlotTokenPrefix(template: string): string {
  let slotTokenPrefix = ANSWER_SLOT_TOKEN_PREFIX;

  while (template.includes(slotTokenPrefix)) {
    slotTokenPrefix = `_${slotTokenPrefix}`;
  }

  return slotTokenPrefix;
}

export const buildHighlightCodeWithSlots = (
  template: string
): HighlightCodeWithSlots => {
  const slotTokens: string[] = [];
  const slotTokenPrefix = getUniqueSlotTokenPrefix(template);
  const highlightCode = template.replace(BLANK_REGEX, () => {
    const token = `${slotTokenPrefix}${slotTokens.length}__`;
    slotTokens.push(token);
    return token;
  });

  return {
    highlightCode,
    slotTokens,
  };
};
