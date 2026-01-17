import { BLANK_REGEX } from "@/constants";

export const splitTemplateIntoParts = (
  template: string
): {
  type: "code" | "input";
  value: string;
  answerIndex: number;
}[] => {
  const result: {
    type: "code" | "input";
    value: string;
    answerIndex: number;
  }[] = [];
  const parts = template.split(BLANK_REGEX);

  for (const [i, part] of parts.entries()) {
    result.push({
      type: "code",
      value: part,
      answerIndex: 0,
    });

    if (i < parts.length - 1) {
      result.push({
        type: "input",
        value: "",
        answerIndex: i,
      });
    }
  }

  return result;
};
