import { describe, it, expect } from 'vitest';
import { CYK } from '../app/CYK';

/*{ aⁿbⁿ | n >= 1 }  —  S -> AB | AX, X -> SB, A -> a, B -> b */
function cfgAnBn() {
  const cfg = new Map();
  cfg.set('S', [['A', 'B'], ['A', 'X']]);
  cfg.set('X', [['S', 'B']]);
  cfg.set('A', [['a']]);
  cfg.set('B', [['b']]);
  return cfg;
}
 
/** Language {ab} — S -> AB, A -> a, B -> b */
function cfgSimpleAB() {
  const cfg = new Map();
  cfg.set('S', [['A', 'B']]);
  cfg.set('A', [['a']]);
  cfg.set('B', [['b']]);
  return cfg;
}
 
/** Even-length palindromes over {a,b}
 *  S -> AA | BB | AX | BY, X -> SA, Y -> SB, A -> a, B -> b */
function cfgEvenPalindromes() {
  const cfg = new Map();
  cfg.set('S', [['A', 'A'], ['B', 'B'], ['A', 'X'], ['B', 'Y']]);
  cfg.set('X', [['S', 'A']]);
  cfg.set('Y', [['S', 'B']]);
  cfg.set('A', [['a']]);
  cfg.set('B', [['b']]);
  return cfg;
}
 
/** Language {a} — S -> a */
function cfgSingleA() {
  const cfg = new Map();
  cfg.set('S', [['a']]);
  return cfg;
}
 
/** Language {ab, cd} — S -> AB | CD */
function cfgTwoWords() {
  const cfg = new Map();
  cfg.set('S', [['A', 'B'], ['C', 'D']]);
  cfg.set('A', [['a']]);
  cfg.set('B', [['b']]);
  cfg.set('C', [['c']]);
  cfg.set('D', [['d']]);
  return cfg;
}
 
/** Language {""} — S -> '' */
function cfgWithEpsilon() {
  const cfg = new Map();
  cfg.set('S', [['']]);
  return cfg;
}
 
/** Language {"", a} — S -> '' | a */
function cfgEpsilonOrA() {
  const cfg = new Map();
  cfg.set('S', [[''], ['a']]);
  return cfg;
}
 
/** { aⁿ | n >= 1 } — S -> a | AS, A -> a */
function cfgOneOrMoreA() {
  const cfg = new Map();
  cfg.set('S', [['a'], ['A', 'S']]);
  cfg.set('A', [['a']]);
  return cfg;
}
 
/** Words over {a,b,c} where first and last char match
 *  S -> AX | BY | CZ | AA | BB | CC | a | b | c
 *  X -> SA, Y -> SB, Z -> SC */
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
 
// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------
function accepts(cfg, word, start = 'S') {
  return CYK(cfg, word, start)[1];
}
 
// ---------------------------------------------------------------------------
// Tests: CYK returns TRUE
// ---------------------------------------------------------------------------
 
describe('CYK returns true', () => {
  it('single terminal: S -> a, word "a"', () => {
    expect(accepts(cfgSingleA(), 'a')).toBe(true);
  });
 
  it('two-word CFG accepts "ab"', () => {
    expect(accepts(cfgTwoWords(), 'ab')).toBe(true);
  });
 
  it('two-word CFG accepts "cd"', () => {
    expect(accepts(cfgTwoWords(), 'cd')).toBe(true);
  });
 
  it('aⁿbⁿ accepts "ab"', () => {
    expect(accepts(cfgAnBn(), 'ab')).toBe(true);
  });
 
  it('aⁿbⁿ accepts "aabb"', () => {
    expect(accepts(cfgAnBn(), 'aabb')).toBe(true);
  });
 
  it('aⁿbⁿ accepts "aaabbb"', () => {
    expect(accepts(cfgAnBn(), 'aaabbb')).toBe(true);
  });
 
  it('aⁿbⁿ accepts "aaaabbbb"', () => {
    expect(accepts(cfgAnBn(), 'aaaabbbb')).toBe(true);
  });
 
  it('empty string: S -> "", word ""', () => {
    expect(accepts(cfgWithEpsilon(), '')).toBe(true);
  });
 
  it('epsilon-or-a CFG accepts ""', () => {
    expect(accepts(cfgEpsilonOrA(), '')).toBe(true);
  });
 
  it('epsilon-or-a CFG accepts "a"', () => {
    expect(accepts(cfgEpsilonOrA(), 'a')).toBe(true);
  });
 
  it('one-or-more-a CFG accepts "a"', () => {
    expect(accepts(cfgOneOrMoreA(), 'a')).toBe(true);
  });
 
  it('one-or-more-a CFG accepts "aa"', () => {
    expect(accepts(cfgOneOrMoreA(), 'aa')).toBe(true);
  });
 
  it('one-or-more-a CFG accepts "aaaa"', () => {
    expect(accepts(cfgOneOrMoreA(), 'aaaa')).toBe(true);
  });
 
  it('even palindromes accepts "aa"', () => {
    expect(accepts(cfgEvenPalindromes(), 'aa')).toBe(true);
  });
 
  it('even palindromes accepts "abba"', () => {
    expect(accepts(cfgEvenPalindromes(), 'abba')).toBe(true);
  });
 
  it('even palindromes accepts "baab"', () => {
    expect(accepts(cfgEvenPalindromes(), 'baab')).toBe(true);
  });
 
  it('even palindromes accepts "aabbaa" (longer even palindrome)', () => {
    expect(accepts(cfgEvenPalindromes(), 'aabbaa')).toBe(true);
  });
 
  it('first-last-match CFG: single char "a"', () => {
    expect(accepts(cfgFirstLastMatch(), 'a')).toBe(true);
  });
 
  it('first-last-match CFG: "aa" (same boundary chars)', () => {
    expect(accepts(cfgFirstLastMatch(), 'aa')).toBe(true);
  });
 
  it('first-last-match CFG: "aba" (a...a)', () => {
    expect(accepts(cfgFirstLastMatch(), 'aba')).toBe(true);
  });
 
  it('CYK returns a 2-element array', () => {
    const result = CYK(cfgSingleA(), 'a', 'S');
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(2);
  });
 
  it('CYK grid has correct row count for word of length 3', () => {
    const [grid] = CYK(cfgAnBn(), 'aab', 'S');
    expect(grid).toHaveLength(3);
  });
});
 
// ---------------------------------------------------------------------------
// Tests: CYK returns FALSE
// ---------------------------------------------------------------------------
 
describe('CYK returns false', () => {
  it('single-a CFG rejects "b"', () => {
    expect(accepts(cfgSingleA(), 'b')).toBe(false);
  });
 
  it('single-a CFG rejects ""', () => {
    expect(accepts(cfgSingleA(), '')).toBe(false);
  });
 
  it('two-word CFG rejects "ac"', () => {
    expect(accepts(cfgTwoWords(), 'ac')).toBe(false);
  });
 
  it('aⁿbⁿ rejects "ba" (reversed)', () => {
    expect(accepts(cfgAnBn(), 'ba')).toBe(false);
  });
 
  it('aⁿbⁿ rejects "aab" (unequal counts)', () => {
    expect(accepts(cfgAnBn(), 'aab')).toBe(false);
  });
 
  it('aⁿbⁿ rejects "abab" (interleaved)', () => {
    expect(accepts(cfgAnBn(), 'abab')).toBe(false);
  });
 
  it('aⁿbⁿ rejects "" (epsilon not in language)', () => {
    expect(accepts(cfgAnBn(), '')).toBe(false);
  });
 
  it('even palindromes rejects "ab" (not a palindrome)', () => {
    expect(accepts(cfgEvenPalindromes(), 'ab')).toBe(false);
  });
 
  it('even palindromes rejects "aab" (odd length)', () => {
    expect(accepts(cfgEvenPalindromes(), 'aab')).toBe(false);
  });
 
  it('one-or-more-a rejects ""', () => {
    expect(accepts(cfgOneOrMoreA(), '')).toBe(false);
  });
 
  it('one-or-more-a rejects "b"', () => {
    expect(accepts(cfgOneOrMoreA(), 'b')).toBe(false);
  });
 
  it('first-last-match CFG rejects "ab" (a ≠ b)', () => {
    expect(accepts(cfgFirstLastMatch(), 'ab')).toBe(false);
  });
 
  it('epsilon CFG rejects "a"', () => {
    expect(accepts(cfgWithEpsilon(), 'a')).toBe(false);
  });
});