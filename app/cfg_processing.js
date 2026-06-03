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
    // console.log(formattedCFG);

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
        while (i<string.length-1 && /[0-9]/.test(string.charAt(i))){
            i++;
            variable+=string.charAt(i);
        }
        
        lst.push(variable);
        i++;
    }

    return lst;
}