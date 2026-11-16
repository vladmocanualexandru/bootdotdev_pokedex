import { Cache } from "./pokecache.js";
import { describe, expect, test, beforeEach, afterEach, beforeAll, afterAll } from "vitest";

const testCache = new Cache(3600000); //no reaping

describe.each([
  {
    input: "nonexisting_key",
    expected: undefined,
  }
])("get_nonexisting($input)", ({ input, expected }) => {
    let testCache: Cache;

    beforeEach(() => {
        testCache = new Cache(10000);
        testCache.stopReapLoop();
    });

    test(`Expected: ${expected}`, () => {
    const actual = testCache.get(input);

    expect(actual).toBe(expected);
  });
});

describe.each([
  {
    input: "existing_key",
    expected: "existing_value",
  }
])("get_existing($input)", ({ input, expected }) => {
    let testCache: Cache;

    beforeEach(() => {
        testCache = new Cache(10000);
        testCache.stopReapLoop();

        testCache.add(input, expected)
    });

    test(`Expected: ${expected}`, () => {
    const actual = testCache.get(input);

    expect(actual).toBe(expected);
  });
});

describe.each([
  {
    input: "key_1",
    expected: "value_1",
  },
  {
    input: "key_2",
    expected: "value_2",
  },
])("add($input) (new)", ({ input, expected }) => {
    let testCache: Cache;

    beforeAll(() => {
        testCache = new Cache(10000);
        testCache.stopReapLoop();
    });

    test(`Expected: ${expected}`, () => {
        let actual = testCache.get(input);
        expect(actual).toBe(undefined);

        testCache.add(input, expected);
        actual = testCache.get(input);
        expect(actual).toBe(expected);
  });
});

describe.each([
  {
    input: "key_1",
    old: "value_1",
    expected: "value_1_2",
  },
  {
    input: "key_2",
    old: "value_2",
    expected: "value_2_2",
  },
])("ovewrite($input)", ({ input, old, expected }) => {
    let testCache: Cache;

    beforeAll(() => {
        testCache = new Cache(10000);
        testCache.stopReapLoop();

        testCache.add("key_1", "value_1");
        testCache.add("key_2", "value_2");
    });

    test(`Expected: ${expected}`, () => {
        let actual = testCache.get(input);
        expect(actual).toBe(old);

        testCache.add(input, expected);
        actual = testCache.get(input);
        expect(actual).toBe(expected);
  });
});

describe.each([
  {
    input: "key",
    expected: "value",
  }
])("check_reap($input)", ({ input, expected }) => {
    let testCache: Cache;

    beforeEach(() => {
        testCache = new Cache(500);
    });

    afterEach(() => {
        testCache.stopReapLoop();
    });

    test(`Expected: ${expected}`, async () => {
        let actual = testCache.get(input);
        expect(actual).toBe(undefined);

        testCache.add(input, expected);
        actual = testCache.get(input);
        expect(actual).toBe(expected);

        await expect.poll(() => testCache.get(input), {timeout: 3000}).toBe(undefined);

  });
});
