import { cleanInput } from "./repl.js";
import { describe, expect, test } from "vitest";

describe.each([
  {
    input: "  hello  world  ",
    expected: ["hello", "world"],
  },
  {
    input: "   hello      ",
    expected: ["hello"],
  },
  {
    input: "the quick brown fox jumps over the lazy dog",
    expected: ["the", "quick", "brown", "fox", "jumps", "over", "the", "lazy", "dog"],
  },
  {
    input: "      ",
    expected: [],
  },
])("cleanInput($input)", ({ input, expected }) => {
  test(`Expected: ${expected}`, () => {
    const actual = cleanInput(input);

    expect(actual).toHaveLength(expected.length);

    for (const i in expected) {
      expect(actual[i]).toBe(expected[i]);
    }
  });
});
