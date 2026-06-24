import { describe, it, expect } from 'vitest';
import { CYK } from '../app/CYK';

/* ── Grammar helpers (same as main suite) ───────────────────────────────── */

function cfgAnBn() {
  const cfg = new Map();
  cfg.set('S', [['A', 'B'], ['A', 'X']]);
  cfg.set('X', [['S', 'B']]);
  cfg.set('A', [['a']]);
  cfg.set('B', [['b']]);
  return cfg;
}

function cfgSimpleAB() {
  const cfg = new Map();
  cfg.set('S', [['A', 'B']]);
  cfg.set('A', [['a']]);
  cfg.set('B', [['b']]);
  return cfg;
}

function cfgEvenPalindromes() {
  const cfg = new Map();
  cfg.set('S', [['A', 'A'], ['B', 'B'], ['A', 'X'], ['B', 'Y']]);
  cfg.set('X', [['S', 'A']]);
  cfg.set('Y', [['S', 'B']]);
  cfg.set('A', [['a']]);
  cfg.set('B', [['b']]);
  return cfg;
}

function cfgSingleA() {
  const cfg = new Map();
  cfg.set('S', [['a']]);
  return cfg;
}

function cfgTwoWords() {
  const cfg = new Map();
  cfg.set('S', [['A', 'B'], ['C', 'D']]);
  cfg.set('A', [['a']]);
  cfg.set('B', [['b']]);
  cfg.set('C', [['c']]);
  cfg.set('D', [['d']]);
  return cfg;
}

function cfgWithEpsilon() {
  const cfg = new Map();
  cfg.set('S', [['']]);
  return cfg;
}

function cfgEpsilonOrA() {
  const cfg = new Map();
  cfg.set('S', [[''], ['a']]);
  return cfg;
}

function cfgOneOrMoreA() {
  const cfg = new Map();
  cfg.set('S', [['a'], ['A', 'S']]);
  cfg.set('A', [['a']]);
  return cfg;
}

function cfgFirstLastMatch() {
  const cfg = new Map();
  cfg.set('S', [
    ['A', 'X'], ['B', 'Y'], ['C', 'Z'],
    ['A', 'A'], ['B', 'B'], ['C', 'C'],
    ['a'], ['b'], ['c'],
  ]);
  cfg.set('X', [['S', 'A']]);
  cfg.set('Y', [['S', 'B']]);
  cfg.set('Z', [['S', 'C']]);
  cfg.set('A', [['a']]);
  cfg.set('B', [['b']]);
  cfg.set('C', [['c']]);
  return cfg;
}

/* ── New grammars ─────────────────────────────────────────────────────────
 *
 * cfgNonDefaultStart  – uses 'T' as start symbol: T -> a
 * cfgAlternatePairs   – { (ab)^n | n >= 1 }: S -> AB | AX, X -> BS, A -> a, B -> b
 * cfgMirrorAB         – { w wᴿ | w ∈ {a,b}* }: even-length palindromes (same as cfgEvenPalindromes)
 * cfgSingleTerminal   – single production S -> z  (tests unfamiliar terminal)
 * cfgDeepBinary       – long right-recursive: S -> AS | a, A -> a  (aⁿ n>=1, same as cfgOneOrMoreA)
 */

function cfgNonDefaultStart() {
  const cfg = new Map();
  cfg.set('T', [['a']]);
  cfg.set('U', [['b']]);
  return cfg;
}

/* { (ab)^n | n >= 1 } */
function cfgAlternatePairs() {
  const cfg = new Map();
  cfg.set('S', [['A', 'B'], ['A', 'X']]);
  cfg.set('X', [['B', 'S']]);
  cfg.set('A', [['a']]);
  cfg.set('B', [['b']]);
  return cfg;
}

/* ── Helper ───────────────────────────────────────────────────────────── */

function accepts(cfg, word, start = 'S') {
  return CYK(cfg, word, start)[1];
}

/* ═══════════════════════════════════════════════════════════════════════
 * LONG WORDS
 * ═══════════════════════════════════════════════════════════════════════ */

describe('long words — aⁿbⁿ accepts', () => {
  it('a^10 b^10', () => {
    expect(accepts(cfgAnBn(), 'a'.repeat(10) + 'b'.repeat(10))).toBe(true);
  });

  it('a^25 b^25', () => {
    expect(accepts(cfgAnBn(), 'a'.repeat(25) + 'b'.repeat(25))).toBe(true);
  });

  it('a^50 b^50', () => {
    expect(accepts(cfgAnBn(), 'a'.repeat(50) + 'b'.repeat(50))).toBe(true);
  });

  it('a^100 b^100', () => {
    expect(accepts(cfgAnBn(), 'a'.repeat(100) + 'b'.repeat(100))).toBe(true);
  });
});

describe('long words — aⁿbⁿ rejects', () => {
  it('a^50 b^49 (one b short)', () => {
    expect(accepts(cfgAnBn(), 'a'.repeat(50) + 'b'.repeat(49))).toBe(false);
  });

  it('a^50 b^51 (one b extra)', () => {
    expect(accepts(cfgAnBn(), 'a'.repeat(50) + 'b'.repeat(51))).toBe(false);
  });

  it('a^49 b^50 (one a short)', () => {
    expect(accepts(cfgAnBn(), 'a'.repeat(49) + 'b'.repeat(50))).toBe(false);
  });

  it('a^100 (no bs at all)', () => {
    expect(accepts(cfgAnBn(), 'a'.repeat(100))).toBe(false);
  });

  it('b^100 (no as at all)', () => {
    expect(accepts(cfgAnBn(), 'b'.repeat(100))).toBe(false);
  });

  it('a^50 b^50 a (trailing a breaks pattern)', () => {
    expect(accepts(cfgAnBn(), 'a'.repeat(50) + 'b'.repeat(50) + 'a')).toBe(false);
  });
});

describe('long words — oneOrMoreA accepts', () => {
  it('a^20', () => {
    expect(accepts(cfgOneOrMoreA(), 'a'.repeat(20))).toBe(true);
  });

  it('a^50', () => {
    expect(accepts(cfgOneOrMoreA(), 'a'.repeat(50))).toBe(true);
  });

  it('a^100', () => {
    expect(accepts(cfgOneOrMoreA(), 'a'.repeat(100))).toBe(true);
  });
});

describe('long words — evenPalindromes accepts', () => {
  it('"a"*20 + "a"*20 (40 as)', () => {
    expect(accepts(cfgEvenPalindromes(), 'a'.repeat(40))).toBe(true);
  });

  it('"b"*30 + "b"*30 (60 bs)', () => {
    expect(accepts(cfgEvenPalindromes(), 'b'.repeat(60))).toBe(true);
  });

  it('"ab"*10 + "ba"*10 (abababababababababababababababababababababab)', () => {
    const w = 'ab'.repeat(10) + 'ba'.repeat(10);
    expect(accepts(cfgEvenPalindromes(), w)).toBe(true);
  });
});

describe('long words — evenPalindromes rejects', () => {
  it('a^39 b (odd length 40)', () => {
    expect(accepts(cfgEvenPalindromes(), 'a'.repeat(39) + 'b')).toBe(false);
  });

  it('"ab" repeated 25 times (not a palindrome)', () => {
    expect(accepts(cfgEvenPalindromes(), 'ab'.repeat(25))).toBe(false);
  });
});

/* ═══════════════════════════════════════════════════════════════════════
 * BOUNDARY / OFF-BY-ONE
 * ═══════════════════════════════════════════════════════════════════════ */

describe('boundary — minimal accepted words', () => {
  it('aⁿbⁿ: shortest accepted word is "ab" (n=1)', () => {
    expect(accepts(cfgAnBn(), 'ab')).toBe(true);
  });

  it('evenPalindromes: shortest accepted word is "aa"', () => {
    expect(accepts(cfgEvenPalindromes(), 'aa')).toBe(true);
  });

  it('evenPalindromes: shortest accepted word is "bb"', () => {
    expect(accepts(cfgEvenPalindromes(), 'bb')).toBe(true);
  });

  it('oneOrMoreA: shortest accepted word is "a"', () => {
    expect(accepts(cfgOneOrMoreA(), 'a')).toBe(true);
  });

  it('firstLastMatch: single "b" is accepted', () => {
    expect(accepts(cfgFirstLastMatch(), 'b')).toBe(true);
  });

  it('firstLastMatch: single "c" is accepted', () => {
    expect(accepts(cfgFirstLastMatch(), 'c')).toBe(true);
  });
});

describe('boundary — one character away from accepted', () => {
  it('simpleAB rejects "a" (missing B)', () => {
    expect(accepts(cfgSimpleAB(), 'a')).toBe(false);
  });

  it('simpleAB rejects "b" (missing A)', () => {
    expect(accepts(cfgSimpleAB(), 'b')).toBe(false);
  });

  it('simpleAB rejects "aba" (extra a)', () => {
    expect(accepts(cfgSimpleAB(), 'aba')).toBe(false);
  });

  it('simpleAB rejects "aab" (extra a)', () => {
    expect(accepts(cfgSimpleAB(), 'aab')).toBe(false);
  });

  it('simpleAB rejects "abb" (extra b)', () => {
    expect(accepts(cfgSimpleAB(), 'abb')).toBe(false);
  });

  it('twoWords rejects "a" alone', () => {
    expect(accepts(cfgTwoWords(), 'a')).toBe(false);
  });

  it('twoWords rejects "abc" (three chars, neither word)', () => {
    expect(accepts(cfgTwoWords(), 'abc')).toBe(false);
  });
});

/* ═══════════════════════════════════════════════════════════════════════
 * EPSILON / EMPTY STRING
 * ═══════════════════════════════════════════════════════════════════════ */

describe('epsilon edge cases', () => {
  it('epsilonOrA rejects "aa"', () => {
    expect(accepts(cfgEpsilonOrA(), 'aa')).toBe(false);
  });

  it('epsilonOrA rejects "b"', () => {
    expect(accepts(cfgEpsilonOrA(), 'b')).toBe(false);
  });

  it('epsilon-only CFG rejects any non-empty word "abc"', () => {
    expect(accepts(cfgWithEpsilon(), 'abc')).toBe(false);
  });

  it('epsilon-only CFG rejects word of length 1 "a"', () => {
    expect(accepts(cfgWithEpsilon(), 'a')).toBe(false);
  });

  it('singleA rejects epsilon', () => {
    expect(accepts(cfgSingleA(), '')).toBe(false);
  });

  it('oneOrMoreA rejects epsilon', () => {
    expect(accepts(cfgOneOrMoreA(), '')).toBe(false);
  });
});

/* ═══════════════════════════════════════════════════════════════════════
 * NON-DEFAULT START SYMBOL
 * ═══════════════════════════════════════════════════════════════════════ */

describe('non-default start symbol', () => {
  it('cfgNonDefaultStart: start=T accepts "a"', () => {
    expect(accepts(cfgNonDefaultStart(), 'a', 'T')).toBe(true);
  });

  it('cfgNonDefaultStart: start=T rejects "b"', () => {
    expect(accepts(cfgNonDefaultStart(), 'b', 'T')).toBe(false);
  });

  it('cfgNonDefaultStart: start=U accepts "b"', () => {
    expect(accepts(cfgNonDefaultStart(), 'b', 'U')).toBe(true);
  });

  it('cfgNonDefaultStart: start=U rejects "a"', () => {
    expect(accepts(cfgNonDefaultStart(), 'a', 'U')).toBe(false);
  });

  it('aⁿbⁿ with start=X rejects "ab" (X cannot derive ab directly)', () => {
    expect(accepts(cfgAnBn(), 'ab', 'X')).toBe(false);
  });

  it('aⁿbⁿ with start=X accepts "abb" (X -> SB, S -> AB)', () => {
    expect(accepts(cfgAnBn(), 'abb', 'X')).toBe(true);
  });
});

/* ═══════════════════════════════════════════════════════════════════════
 * RETURN VALUE STRUCTURE
 * ═══════════════════════════════════════════════════════════════════════ */

describe('CYK return value structure', () => {
  it('returns [grid, bool, table] for a rejected word', () => {
    const result = CYK(cfgSingleA(), 'b', 'S');
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(3);
    expect(result[1]).toBe(false);
  });

  it('grid has correct row count for word of length 1', () => {
    const [grid] = CYK(cfgSingleA(), 'a', 'S');
    expect(grid).toHaveLength(1);
  });

  it('grid has correct row count for word of length 2', () => {
    const [grid] = CYK(cfgSimpleAB(), 'ab', 'S');
    expect(grid).toHaveLength(2);
  });

  it('grid has correct row count for word of length 5', () => {
    const [grid] = CYK(cfgAnBn(), 'aaaaa', 'S');
    expect(grid).toHaveLength(5);
  });

  it('grid[0] (bottom row) has same length as input word', () => {
    const word = 'aabb';
    const [grid] = CYK(cfgAnBn(), word, 'S');
    expect(grid[grid.length-1]).toHaveLength(word.length);
  });

  it('epsilon input: grid is empty (length 0)', () => {
    const [grid] = CYK(cfgWithEpsilon(), '', 'S');
    expect(grid).toHaveLength(1);
  });
});

/* ═══════════════════════════════════════════════════════════════════════
 * ALTERNATING-PAIRS GRAMMAR
 * ═══════════════════════════════════════════════════════════════════════ */

describe('alternating pairs {(ab)^n | n>=1}', () => {
  it('accepts "ab"', () => {
    expect(accepts(cfgAlternatePairs(), 'ab')).toBe(true);
  });

  it('accepts "abab"', () => {
    expect(accepts(cfgAlternatePairs(), 'abab')).toBe(true);
  });

  it('accepts "ababab"', () => {
    expect(accepts(cfgAlternatePairs(), 'ababab')).toBe(true);
  });

  it('rejects "a"', () => {
    expect(accepts(cfgAlternatePairs(), 'a')).toBe(false);
  });

  it('rejects "ba"', () => {
    expect(accepts(cfgAlternatePairs(), 'ba')).toBe(false);
  });

  it('rejects "aba" (odd length)', () => {
    expect(accepts(cfgAlternatePairs(), 'aba')).toBe(false);
  });

  it('rejects "aabb" (wrong order)', () => {
    expect(accepts(cfgAlternatePairs(), 'aabb')).toBe(false);
  });
});

/* ═══════════════════════════════════════════════════════════════════════
 * FIRST-LAST-MATCH EXTRAS
 * ═══════════════════════════════════════════════════════════════════════ */

describe('firstLastMatch additional cases', () => {
  it('accepts "bab" (b...b)', () => {
    expect(accepts(cfgFirstLastMatch(), 'bab')).toBe(true);
  });

  it('accepts "cac" (c...c)', () => {
    expect(accepts(cfgFirstLastMatch(), 'cac')).toBe(true);
  });

  it('accepts "bcb" (b...b)', () => {
    expect(accepts(cfgFirstLastMatch(), 'bcb')).toBe(true);
  });

  it('rejects "abc" (a ≠ c)', () => {
    expect(accepts(cfgFirstLastMatch(), 'abc')).toBe(false);
  });

  it('rejects "cab" (c ≠ b)', () => {
    expect(accepts(cfgFirstLastMatch(), 'cab')).toBe(false);
  });

  it('accepts "abcba" (a...a, length 5)', () => {
    expect(accepts(cfgFirstLastMatch(), 'abcba')).toBe(true);
  });

  it('rejects "" (epsilon)', () => {
    expect(accepts(cfgFirstLastMatch(), '')).toBe(false);
  });
});




/* ── cfgAnB2n ─────────────────────────────────────────────────────────────
 * { aⁿ b²ⁿ | n >= 1 }
 * S -> A Q | A X,   X -> S Q,   Q -> B B,   A -> a,   B -> b
 * Derivation check:
 *   n=1: S -> AQ -> a(BB) -> abb  ✓
 *   n=2: S -> AX -> a(SQ) -> a(AQ)(BB) -> a(aBB)(BB) -> aabbbb  ✓
 */
function cfgAnB2n() {
  const cfg = new Map();
  cfg.set('S', [['A', 'Q'], ['A', 'X']]);
  cfg.set('X', [['S', 'Q']]);
  cfg.set('Q', [['B', 'B']]);
  cfg.set('A', [['a']]);
  cfg.set('B', [['b']]);
  return cfg;
}

/* ── cfgAnBmCm ────────────────────────────────────────────────────────────
 * { aⁿ bᵐ cᵐ | n >= 1, m >= 1 }

 */
function cfgAnBmCm() {
  const cfg = new Map();
  cfg.set('S',  [['A', 'X']]);
  cfg.set('X',  [['V0', 'V1'], ['V2', 'V1']]);
  cfg.set('A',  [['V3', 'A'], ['a']]);
  cfg.set('V0', [['V2', 'X']]);
  cfg.set('V1', [['c']]);
  cfg.set('V2', [['b']]);
  cfg.set('V3', [['a']]);
  return cfg;
}

/* ── cfgNestedAB ──────────────────────────────────────────────────────────
 * { aⁱ bʲ aⁱ | i >= 1, j >= 1 }

 */
function cfgNestedAB() {

  const cfg = new Map();
  cfg.set('V0', [['V1', 'V3'], ['V2', 'V3']]);
  cfg.set('S',  [['V1', 'V3'], ['V2', 'V3']]);
  cfg.set('X',  [['V4', 'X'], ['b']]);
  cfg.set('V1', [['V3', 'S']]);
  cfg.set('V2', [['V3', 'X']]);
  cfg.set('V3', [['a']]);
  cfg.set('V4', [['b']]);
  return cfg;
}

/* ── cfgCentreMarked ──────────────────────────────────────────────────────
 * { w c wᴿ | w ∈ {a,b}* } — centre-marked palindromes over {a,b,c}
 * where c is the unique centre marker (appears exactly once).
 * Includes the word "c" itself (w = ε).
 * S -> c | A SA | B SB,   A -> a,   B -> b
 * In CNF (remove unit rules; S -> c stays as terminal rule):
 *   S  -> C | A X | B Y
 *   X  -> S A,   Y -> S B
 *   A  -> a,   B -> b,   C -> c
 */
function cfgCentreMarked() {
  const cfg = new Map();
  cfg.set('S', [['c'], ['A', 'X'], ['B', 'Y']]);
  cfg.set('X', [['S', 'A']]);
  cfg.set('Y', [['S', 'B']]);
  cfg.set('A', [['a']]);
  cfg.set('B', [['b']]);
  cfg.set('C', [['c']]);
  return cfg;
}


/* ═══════════════════════════════════════════════════════════════════════
 * cfgAnB2n — { aⁿ b²ⁿ | n >= 1 }
 * ═══════════════════════════════════════════════════════════════════════ */

describe('aⁿb²ⁿ accepts', () => {
  it('"abb" (n=1)', () => {
    expect(accepts(cfgAnB2n(), 'abb')).toBe(true);
  });

  it('"aabbbb" (n=2)', () => {
    expect(accepts(cfgAnB2n(), 'aabbbb')).toBe(true);
  });

  it('"aaabbbbbb" (n=3)', () => {
    expect(accepts(cfgAnB2n(), 'aaabbbbbb')).toBe(true);
  });

  it('a^10 b^20 (n=10)', () => {
    expect(accepts(cfgAnB2n(), 'a'.repeat(10) + 'b'.repeat(20))).toBe(true);
  });

  it('a^25 b^50 (n=25)', () => {
    expect(accepts(cfgAnB2n(), 'a'.repeat(25) + 'b'.repeat(50))).toBe(true);
  });
});

describe('aⁿb²ⁿ rejects', () => {
  it('"ab" — only one b', () => {
    expect(accepts(cfgAnB2n(), 'ab')).toBe(false);
  });

  it('"abbb" — three bs for one a', () => {
    expect(accepts(cfgAnB2n(), 'abbb')).toBe(false);
  });

  it('"aabb" — equal counts (aⁿbⁿ, not aⁿb²ⁿ)', () => {
    expect(accepts(cfgAnB2n(), 'aabb')).toBe(false);
  });

  it('"aabbbbb" — five bs for two as', () => {
    expect(accepts(cfgAnB2n(), 'aabbbbb')).toBe(false);
  });

  it('a^10 b^19 — one b short', () => {
    expect(accepts(cfgAnB2n(), 'a'.repeat(10) + 'b'.repeat(19))).toBe(false);
  });

  it('a^10 b^21 — one b over', () => {
    expect(accepts(cfgAnB2n(), 'a'.repeat(10) + 'b'.repeat(21))).toBe(false);
  });

  it('empty string', () => {
    expect(accepts(cfgAnB2n(), '')).toBe(false);
  });
});

/* ═══════════════════════════════════════════════════════════════════════
 * cfgAnBmCm — { aⁿ bᵐ cᵐ | n,m >= 1 }
 * ═══════════════════════════════════════════════════════════════════════ */

describe('aⁿbᵐcᵐ accepts', () => {
  it('"abc" (n=1, m=1)', () => {
    expect(accepts(cfgAnBmCm(), 'abc')).toBe(true);
  });

  it('"abbcc" (n=1, m=2)', () => {
    expect(accepts(cfgAnBmCm(), 'abbcc')).toBe(true);
  });

  it('"aabc" (n=2, m=1)', () => {
    expect(accepts(cfgAnBmCm(), 'aabc')).toBe(true);
  });

  it('"aabbcc" (n=2, m=2)', () => {
    expect(accepts(cfgAnBmCm(), 'aabbcc')).toBe(true);
  });

  it('"aaabbcc" (n=3, m=2)', () => {
    expect(accepts(cfgAnBmCm(), 'aaabbcc')).toBe(true);
  });

  it('"abbbccc" (n=1, m=3)', () => {
    expect(accepts(cfgAnBmCm(), 'abbbccc')).toBe(true);
  });

  it('a^5 b^10 c^10', () => {
    expect(accepts(cfgAnBmCm(), 'a'.repeat(5) + 'b'.repeat(10) + 'c'.repeat(10))).toBe(true);
  });

  it('a^10 b^1 c^1', () => {
    expect(accepts(cfgAnBmCm(), 'a'.repeat(10) + 'bc')).toBe(true);
  });
});

describe('aⁿbᵐcᵐ rejects', () => {
  it('"bc" — no leading a', () => {
    expect(accepts(cfgAnBmCm(), 'bc')).toBe(false);
  });

  it('"ab" — no c part', () => {
    expect(accepts(cfgAnBmCm(), 'ab')).toBe(false);
  });

  it('"abbc" — m mismatch (2 bs, 1 c)', () => {
    expect(accepts(cfgAnBmCm(), 'abbc')).toBe(false);
  });

  it('"abcc" — m mismatch (1 b, 2 cs)', () => {
    expect(accepts(cfgAnBmCm(), 'abcc')).toBe(false);
  });

  it('"acb" — wrong order', () => {
    expect(accepts(cfgAnBmCm(), 'acb')).toBe(false);
  });

  it('"bac" — a not at start', () => {
    expect(accepts(cfgAnBmCm(), 'bac')).toBe(false);
  });

  it('"abc" with start symbol H — H derives only a+', () => {
    expect(accepts(cfgAnBmCm(), 'abc', 'H')).toBe(false);
  });

  it('a^5 b^5 c^6 — one extra c', () => {
    expect(accepts(cfgAnBmCm(), 'a'.repeat(5) + 'b'.repeat(5) + 'c'.repeat(6))).toBe(false);
  });
});

/* ═══════════════════════════════════════════════════════════════════════
 * cfgNestedAB — { aⁱ bʲ aⁱ | i,j >= 1 }
 * ═══════════════════════════════════════════════════════════════════════ */

describe('aⁱbʲaⁱ accepts', () => {
  it('"aba" (i=1, j=1)', () => {
    expect(accepts(cfgNestedAB(), 'aba')).toBe(true);
  });

  it('"abba" (i=1, j=2)', () => {
    expect(accepts(cfgNestedAB(), 'abba')).toBe(true);
  });

  it('"abbba" (i=1, j=3)', () => {
    expect(accepts(cfgNestedAB(), 'abbba')).toBe(true);
  });

  it('"aabaa" (i=2, j=1)', () => {
    expect(accepts(cfgNestedAB(), 'aabaa')).toBe(true);
  });

  it('"aabbaa" (i=2, j=2)', () => {
    expect(accepts(cfgNestedAB(), 'aabbaa')).toBe(true);
  });

  it('"aaabbaaa" (i=3, j=2)', () => {
    expect(accepts(cfgNestedAB(), 'aaabbaaa')).toBe(true);
  });

  it('a^10 b^5 a^10', () => {
    expect(accepts(cfgNestedAB(), 'a'.repeat(10) + 'b'.repeat(5) + 'a'.repeat(10))).toBe(true);
  });

  it('a^1 b^20 a^1', () => {
    expect(accepts(cfgNestedAB(), 'a' + 'b'.repeat(20) + 'a')).toBe(true);
  });
});

describe('aⁱbʲaⁱ rejects', () => {
  it('"aa" — no b in middle', () => {
    expect(accepts(cfgNestedAB(), 'aa')).toBe(false);
  });

  it('"abaa" — i=1 left, i=2 right', () => {
    expect(accepts(cfgNestedAB(), 'abaa')).toBe(false);
  });

  it('"aaba" — i=2 left, i=1 right', () => {
    expect(accepts(cfgNestedAB(), 'aaba')).toBe(false);
  });

  it('"bab" — b on the outside', () => {
    expect(accepts(cfgNestedAB(), 'bab')).toBe(false);
  });

  it('"ab" — no closing a', () => {
    expect(accepts(cfgNestedAB(), 'ab')).toBe(false);
  });

  it('"ba" — no opening a', () => {
    expect(accepts(cfgNestedAB(), 'ba')).toBe(false);
  });

  it('a^5 b^3 a^6 — asymmetric outer as', () => {
    expect(accepts(cfgNestedAB(), 'a'.repeat(5) + 'b'.repeat(3) + 'a'.repeat(6))).toBe(false);
  });

  it('empty string', () => {
    expect(accepts(cfgNestedAB(), '')).toBe(false);
  });
});

/* ═══════════════════════════════════════════════════════════════════════
 * cfgCentreMarked — { w c wᴿ | w ∈ {a,b}* }
 * ═══════════════════════════════════════════════════════════════════════ */

describe('centre-marked palindromes { w c wᴿ } accepts', () => {
  it('"c" (w = ε)', () => {
    expect(accepts(cfgCentreMarked(), 'c')).toBe(true);
  });

  it('"aca" (w = a)', () => {
    expect(accepts(cfgCentreMarked(), 'aca')).toBe(true);
  });

  it('"bcb" (w = b)', () => {
    expect(accepts(cfgCentreMarked(), 'bcb')).toBe(true);
  });

  it('"abcba" (w = ab)', () => {
    expect(accepts(cfgCentreMarked(), 'abcba')).toBe(true);
  });

  it('"bacab" (w = ba)', () => {
    expect(accepts(cfgCentreMarked(), 'bacab')).toBe(true);
  });

  it('"aabcbaa" (w = aab)', () => {
    expect(accepts(cfgCentreMarked(), 'aabcbaa')).toBe(true);
  });

  it('"abacaba" (w = aba)', () => {
    expect(accepts(cfgCentreMarked(), 'abacaba')).toBe(true);
  });

  it('a^10 c a^10', () => {
    expect(accepts(cfgCentreMarked(), 'a'.repeat(10) + 'c' + 'a'.repeat(10))).toBe(true);
  });

  it('"ab"*5 + c + "ba"*5', () => {
    expect(accepts(cfgCentreMarked(), 'ab'.repeat(5) + 'c' + 'ba'.repeat(5))).toBe(true);
  });
});

describe('centre-marked palindromes { w c wᴿ } rejects', () => {
  it('empty string', () => {
    expect(accepts(cfgCentreMarked(), '')).toBe(false);
  });

  it('"ac" — no matching a after c', () => {
    expect(accepts(cfgCentreMarked(), 'ac')).toBe(false);
  });

  it('"acb" — a ≠ b', () => {
    expect(accepts(cfgCentreMarked(), 'acb')).toBe(false);
  });

  it('"abcab" — wᴿ should be "ba" not "ab"', () => {
    expect(accepts(cfgCentreMarked(), 'abcab')).toBe(false);
  });

  it('"acc" — "cc" is not w c wᴿ for any non-empty w', () => {
    expect(accepts(cfgCentreMarked(), 'acc')).toBe(false);
  });

  it('"acca" — two cs', () => {
    expect(accepts(cfgCentreMarked(), 'acca')).toBe(false);
  });

  it('"aab" — no c at all', () => {
    expect(accepts(cfgCentreMarked(), 'aab')).toBe(false);
  });

  it('a^5 c a^4 — asymmetric', () => {
    expect(accepts(cfgCentreMarked(), 'a'.repeat(5) + 'c' + 'a'.repeat(4))).toBe(false);
  });
});

/* ═══════════════════════════════════════════════════════════════════════
 * WORDS WITH UNKNOWN / OUT-OF-ALPHABET TERMINALS
 * ═══════════════════════════════════════════════════════════════════════ */

describe('out-of-alphabet inputs', () => {
  it('singleA CFG rejects "z" (unknown terminal)', () => {
    expect(accepts(cfgSingleA(), 'z')).toBe(false);
  });

  it('aⁿbⁿ CFG rejects "ac" (c not in grammar)', () => {
    expect(accepts(cfgAnBn(), 'ac')).toBe(false);
  });

  it('simpleAB CFG rejects "xy" (both unknown)', () => {
    expect(accepts(cfgSimpleAB(), 'xy')).toBe(false);
  });

  it('aⁿbⁿ CFG rejects "a1b" (digit not in grammar)', () => {
    expect(accepts(cfgAnBn(), 'a1b')).toBe(false);
  });
});