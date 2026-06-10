
function applyStartRule(map, additional_rules, start, count){
    for ([Key, value] of map){
        for (production of value){
            for (variable of production){
                if (variable == start){
                    // create new start variable
                    let newStart = 'V'+count;
                    count++;
                    while (map.has(newStart)){
                        newStart = 'V'+count;
                        count++;
                    }

                    map.set(newStart, [[start]])
                    additional_rules.set([start], newStart)
                    return [newStart,count,map,additional_rules];

                }
            }
        }

    }
    return [start, count, map, additional_rules]; // start variable not present on RHS
}

function applyBinRule(map, additional_rules, count){
    for ([key, value] of map){
        for (let i=0; i<value.length; i++){
            production = value[i];
            while (production.length>2){
                let vars = production.slice(0,2);
                if (additional_rules.has(vars)){
                    production=[additional_rules.get(vars)].concat(production.slice(2));
                }
                else{
                    let newVar = 'V'+count;
                    count++;
                    while (map.has(newVar)){
                        newVar = 'V'+count;
                        count++
                    }
                    production=[newVar].concat(production.slice(2));
                    additional_rules.set(vars, newVar);
                    map.set(newVar, [vars]);
                }
            }
            value[i] = production; // updates rule in CFG
        }
    }
    return [count, map, additional_rules];
}


let map = new Map();
let additional_rules = new Map();
map.set('S', [['a', 'S', 'b'], ['']]);
let start = 'S';
let count = 0;

console.log("Start rule");
[start, count, map, additional_rules] = applyStartRule(map, additional_rules, start, count);
console.log(map);
[count, map, additional_rules] = applyBinRule(map, additional_rules, count);
console.log("Bin rule");
console.log(map);