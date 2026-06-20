function applyStartRule(map, additional_rules, start, count){
    for (let [Key, value] of map){
        for (let production of value){
            for (let variable of production){
                if (variable == start){
                    // create new start variable
                    let newStart = 'V'+count;
                    count++;
                    while (map.has(newStart)){
                        newStart = 'V'+count;
                        count++;
                    }

                    map.set(newStart, [[start]])
                    additional_rules.set(start, newStart)
                    return [newStart,count,map,additional_rules];

                }
            }
        }

    }
    return [start, count, map, additional_rules]; // start variable not present on RHS
}

function applyBinRule(map, additional_rules, count){
    for (let [key, value] of map){
        for (let i=0; i<value.length; i++){
            let production = value[i];
            while (production.length>2){
                let vars = production.slice(0,2).toString();
                
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
                    map.set(newVar, [vars.split(',')]);
                    
                    
                }
            }
            value[i] = production; // updates rule in CFG
        }
    }
    return [count, map, additional_rules];
}



// returns true if a subarray is in a 2d array flase otherwise
function subarrayInArray(item, arr){
    let string = item.toString();
    for (let element of arr){
        if (element.toString() == string){
            return true;
        }
    }
    return false;
}

// returns updated hashmap of the CFG after removing epsilon productions from nullables other than the start variable
function applyDelRule(map, start){
   
    let nullables = getNullables(map);
    console.log(nullables);
    map = modifyProductions(map, nullables, start)
    console.log(map)
    return map;
}

// returns index of first instance of a subarray in a 2d array
function getSubArrayIndex(subarray, arr){
    let string = subarray.toString();
    for (let i=0; i<arr.length; i++){
        if (arr[i].toString() == string){
            console.log("Index to delete "+ i)
            return i
        }
    }
    return -1; // not found
}

// returns true if no unit rule exists, false otherwise
function hasUnitRule(map){
    for (let [key, value] of map){
        for (let production of value){
            if (production.length == 1 && /^([A-Z]|[A-Z][0-9]*)$/.test(production[0])){
                return true;
            }
        }
    }
    return false;
}

// Removed unit rules
function applyUnitRule(map){
    while (hasUnitRule(map)){
        for (let [key, value] of map){
            let vars = []
            for (let production of value){
                // if production is a single non-terminal
                if (production.length == 1 && /^([A-Z]|[A-Z][0-9]*)$/.test(production[0])){
                    vars = vars.concat(production[0]);
                }
            }

            for (let variable of vars){
                value.splice(getSubArrayIndex(variable, value),1);
                // If non-terminal is same as thekey is can be deleted without replacement
                if (variable != key){ 
                    let productions = map.get(variable);
                    
                    for (let prod of productions){
                        // prevents duplicate productions
                        if (!subarrayInArray(prod, value)){
                            value = value.concat([prod]);
                        }
                    }
                    
                    
                    map.set(key, value);
                }
                
            }
        }

    }
    
    return map;
}

// Ensures that productions with more than 1 character only consist of non-terminals
function applyTermRule(map, additional_rules, count){
    for (let [key, value] of map){
        for (let production of value){
            if (production.length > 1){
                for (let i =0; i<production.length; i++){
                    if (/^[a-z0-9]$/.test(production[i])){
                        let symbol = production[i]
                        console.log("Symbol");
                        console.log([symbol]);
                        if (additional_rules.has(symbol)){
                            console.log(true);
                            production[i] = additional_rules.get(symbol);
                        }
                        else{
                            let newVar = 'V'+count;
                            count++
                            while (map.has(newVar)){
                                newVar = 'V'+count;
                                count++;
                            }

                            production[i] = newVar;
                            additional_rules.set([symbol].toString(), newVar);
                            map.set(newVar, [[symbol]])
                        }
                    }
                }
            }
        }
    }
    return [map, additional_rules, count];
}





export function convert_to_CNF(map, start){
    let additional_rules = new Map();
    let count = 0;

    console.log("Start rule");
    [start, count, map, additional_rules] = applyStartRule(map, additional_rules, start, count);
    console.log(map);
    console.log(start);
    [count, map, additional_rules] = applyBinRule(map, additional_rules, count);
    console.log("Bin rule");
    console.log(map);

    console.log("DEL");
    map = applyDelRule(map,start);

    console.log("UNIT");
    map = applyUnitRule(map);
    console.log(map);

    console.log("TERM");
    [map, additional_rules, count] = applyTermRule(map, additional_rules, count);
    console.log(map);
    console.log(additional_rules)
    return [map, start];

}

// Modifies productions to remove epsilon from variables other than start variable
function modifyProductions(map, nullables, start){
    for (let [key, value] of map){
        for (let production of value){
            for (let i=0; i<production.length; i++){
                if (nullables.includes(production[i])){
                    let newProduction = production.slice(0,i).concat(production.slice(i+1));
                    
                    if (!subarrayInArray(newProduction, value)){
                        console.log("New Prod "+newProduction)
                        if (newProduction.toString() == [].toString()){
                            newProduction = [''];
                        }
                        value = value.concat([newProduction])
                        console.log("New value")
                        console.log(value)
                        map.set(key, value)
                        console.log(map)
                    }
                }
            }
        }
    }
    
    // removes epsilon transition from non-start 
    for (let [key, value] of map){
        if (key!=start){
            while (subarrayInArray([''], value)){
                let index = getSubArrayIndex([''],value)
                value.splice(index,1);
                console.log("new val "+value)
                map.set(key, value)
            }
        }
    }
    return map;
}

// returns a list of nullable variables
function getNullables(map){
    let res = []
    
    for (let [key, value] of map){
        if (isNullable(key, map, [])){
            res.push(key)
        }
    }
    
    return res;
}

// returns true if a variable is nullable, false otherwise
function isNullable(key, map, visited){
    visited.push(key)
   
    console.log("Is Nullable");
    console.log(key);
    
    if (!map.has(key)){return false;}
    if (subarrayInArray([''], map.get(key))){
        return true;
    }
    
    
    for (let production of map.get(key)){
        let res = true;
        for (let symbol of production){
            // prevents infinte loop when symbol is equal to the 
            if (!visited.includes(symbol)){
                res = res &&isNullable(symbol, map, visited)

            }
        }
        if (res){
            return true
        }
        
    }
    return false
}

