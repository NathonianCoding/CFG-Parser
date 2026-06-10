// formats cfg into a hashmap where the key is a string and the value is a 2d array
export function formatCFG(cfg){
    let formattedCFG = new Map();
    let array=cfg.split(';');
    //console.log(array); 
    for(let i=0; i<array.length; i++){
        let rule = array[i];
        // obtains start variable and separates it from its transitions
        rule = rule.split('→');
        let start = rule[0];
        let transitions = rule[1];
        //console.log(start);
        //console.log(transitions);
        //converts transitions into an array
        transitions = transitions.split('|');

        let list_of_vars_2d=[];
        for (let j=0; j<transitions.length; j++){
            let raw=transitions[j];
            let sublist = getVarsList(raw)
          
            list_of_vars_2d.push(sublist);
        }
        // console.log(start);
        // console.log(list_of_vars_2d);
        formattedCFG.set(start, list_of_vars_2d);
    }
    console.log(formattedCFG);

    return formattedCFG;
}

// takes a string of terminals and non-terminals and returns an arrray delimiting the variables
function getVarsList(string){
    let lst = [];
    if (string == 'ε'){
        return [''];
    }
    let i=0;
    while (i<string.length){
        let variable = "" + string.charAt(i);
        // Adds a non-terminal with a number as one element
        while (i<string.length-1 && /[A-Z]/.test(string.charAt(i))  && /[0-9]/.test(string.charAt(i+1))){
            i++;
            variable+=string.charAt(i);
        }
        
        lst.push(variable);
        i++;
    }

    return lst;
}

export function checkInCNF(cfg, start){
    for (let [key, value] of cfg){
        for (let array of value){
            console.log("Prod rule: "+ array.join(''))
            let symbol = array.join(''); //combines individual terminal/non-terminal variables to a single variable
            console.log("Array: "+ array.toString())
            if (!(checkStart(start, array) && checkProductionLength(array) && checkEpsilon(start, symbol, key) && checkUnitRule(symbol) && checkTerm(array))){
                
                return false;
            }
            }
        }
    return true;
}
    



function checkStart(start, array){
    for (let symbol of array){
        if (symbol == start){
            console.log("Failed start: start=" + start + " Symbol = " + symbol);
            return false;
        }

    }
    
    return true;
}

function checkProductionLength(array){
    if (array.length>2){
        console.log("Failed length: " + array.toString())
    }
    return array.length<=2;

}

function checkEpsilon(start, symbol, key){
   
    if (symbol == '' && start!=key){
        console.log("Failed Epsilon: "+ start + ", " + symbol + "Key " + key);
        return false;
    }

    
    
    return true;
}

function checkUnitRule(symbol){
   
    if (symbol.length == 1){
        if (!(/[a-z0-9]/.test(symbol))){
            console.log("Failed unit: " + symbol);
        }
            
        return /[a-z0-9]/.test(symbol);
    }

    else if (symbol.length==2){
        if (!(!/[A-Z][0-9]/.test(symbol))){
            console.log("Failed unit: " + symbol);
        }
        
        return !/[A-Z][0-9]/.test(symbol); // chevks if it is a non-terminal with a number
    }
    return true;
}

function checkTerm(array){
    if (array.length>1){
        for (let symbol of array){
            if (/^[a-z0-9]$/.test(symbol)){
                console.log("Failed term: "+ symbol)
                return false;
            }
        }

    }
    return true;
}

