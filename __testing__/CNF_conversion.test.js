import {checkInCNF} from "../app/CNF_format_check";
import {convert_to_CNF} from "../app/CNF_conversion";
import { expect, test } from 'vitest'

let map1 = new Map();
map1.set('S', [['a', 'a', 'a', 'S'], ['a','a','b'],['b']]);

let map2 = new Map();
map2.set('S', [['S', 'X'], ['b']]);
map2.set('X', [['X', 'S'], ['b']]);

let map3 = new Map();
map3.set('S0', [['S', 'X']]);
map3.set('S', [['S', 'X'], ['b']]);
map3.set('X', [['X', 'S'], ['b'], ['']]);


test("S->aaS|aab|b is not in CNF", ()=>{
    expect(checkInCNF(map1, 'S')).toBe(false);
})

test("S->aaS|aab|b converted to CNF", ()=>{
    expect(checkInCNF(convert_to_CNF(map1, 'S'), 'S')).toBe(true);
})

test("S → SX | b; X → XS | b is not in CNF", ()=>{
    expect(checkInCNF(map2, 'S')).toBe(false);
})

test("S → SX | b; X → XS | b converted to CNF", ()=>{
    expect(checkInCNF(convert_to_CNF(map2, 'S'), 'S')).toBe(true);
})

test("S0 → SX; S → SX | b; X → XS | b | ε is not in CNF", ()=>{
    expect(checkInCNF(map3, 'S0')).toBe(false);
})

test("S0 → SX; S → SX | b; X → XS | b | ε", ()=>{
    expect(checkInCNF(convert_to_CNF(map3, 'S0'), 'S0')).toBe(true);
})