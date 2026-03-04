import { useMemo } from "react";
import { buildHighlightCodeWithSlots } from "../utils/-programOutputUtils";
import { buildSlotTokenRegex } from "../utils/-codeHighlightUtils";

export function useCodeHighlightSlots(code: string): {
  highlightCode: string;
  slotTokenToIndex: Map<string, number>;
  slotTokenRegex: RegExp | null;
} {
  const { highlightCode, slotTokens } = useMemo(
    () => buildHighlightCodeWithSlots(code),
    [code]
  );
  const slotTokenToIndex = useMemo(
    () => new Map(slotTokens.map((token, index) => [token, index])),
    [slotTokens]
  );
  const slotTokenRegex = useMemo(
    () => buildSlotTokenRegex(slotTokens),
    [slotTokens]
  );

  return {
    highlightCode,
    slotTokenToIndex,
    slotTokenRegex,
  };
}
