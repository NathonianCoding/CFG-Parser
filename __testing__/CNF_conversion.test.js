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

let test1 = checkInCNF(map1, 'S');


test("S->aaS|aab|b is not in CNF", ()=>{
    expect(test1).toBe(false);
})
let [map1_in_CNF, map1_start] = convert_to_CNF(map1, 'S');
let test2 = checkInCNF(map1_in_CNF, map1_start);
test("S->aaS|aab|b converted to CNF", ()=>{
    expect(test2).toBe(true);
})

let test3 = checkInCNF(map2, 'S'); 
test("S → SX | b; X → XS | b is not in CNF", ()=>{
    expect(test3).toBe(false);
})

let [map2_in_CNF, map2_start] = convert_to_CNF(map2, 'S');
let test4 = checkInCNF(map2_in_CNF, map2_start); 
test("S → SX | b; X → XS | b converted to CNF", ()=>{
    expect(test4).toBe(true);
})

console.log("Map 3")
let test5 = checkInCNF(map3, 'S0');

test("S0 → SX; S → SX | b; X → XS | b | ε is not in CNF", ()=>{
    expect(test5).toBe(false);
})

let [map3_in_CNF, map3_start] = convert_to_CNF(map3, 'S0'); 
let test6 = checkInCNF(map3_in_CNF, map3_start);
test("S0 → SX; S → SX | b; X → XS | b | ε converted to CNF", ()=>{
    expect(test6).toBe(true);
})