import { checkInCNF } from "../app/CNF_format_check";
import { convert_to_CNF } from "../app/CNF_conversion";
import { describe, expect, test } from 'vitest';

// Factory functions: each call returns a brand-new Map,
// so no test can accidentally see another test's mutations.
const makeGrammar1 = () => {
  const map = new Map();
  map.set('S', [['a', 'a', 'a', 'S'], ['a', 'a', 'b'], ['b']]);
  return map;
};

const makeGrammar2 = () => {
  const map = new Map();
  map.set('S', [['S', 'X'], ['b']]);
  map.set('X', [['X', 'S'], ['b']]);
  return map;
};

const makeGrammar3 = () => {
  const map = new Map();
  map.set('S0', [['S', 'X']]);
  map.set('S', [['S', 'X'], ['b']]);
  map.set('X', [['X', 'S'], ['b'], ['']]);
  return map;
};

describe("S->aaS|aab|b", () => {
  test("is not in CNF", () => {
    expect(checkInCNF(makeGrammar1(), 'S')).toBe(false);
  });

  test("converts to CNF correctly", () => {
    const [cnfMap, start] = convert_to_CNF(makeGrammar1(), 'S');
    expect(checkInCNF(cnfMap, start)).toBe(true);
  });
});

describe("S → SX | b; X → XS | b", () => {
  test("is not in CNF", () => {
    expect(checkInCNF(makeGrammar2(), 'S')).toBe(false);
  });

  test("converts to CNF correctly", () => {
    const [cnfMap, start] = convert_to_CNF(makeGrammar2(), 'S');
    expect(checkInCNF(cnfMap, start)).toBe(true);
  });
});

describe("S0 → SX; S → SX | b; X → XS | b | ε", () => {
  test("is not in CNF", () => {
    expect(checkInCNF(makeGrammar3(), 'S0')).toBe(false);
  });

  test("converts to CNF correctly", () => {
    const [cnfMap, start] = convert_to_CNF(makeGrammar3(), 'S0');
    expect(checkInCNF(cnfMap, start)).toBe(true);
  });
});