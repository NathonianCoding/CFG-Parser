class Node {
    constructor(name) {
        this.name = name;
        this.children = [];
    }
}

// Creates and fills the CYK table
export function CYK(cfg, word, start) {
    console.log("VAMOS")
    let CYK_grid = [];

    for (let i = word.length; i > 0; i--) {
        let sublist = [];

        // Ensure each cell has its own array
        for (let j = 0; j < i; j++) {
            sublist.push([]);
        }

        CYK_grid.push(sublist);
    }
   
    if (word == ''){
        CYK_grid = [[[]]]
    }
    populateGrid(CYK_grid, cfg, word);
    console.log(CYK_grid);
    let root = null;
    let inLanguage = false;
    // obtains root and checks if the word was in the language
    for (let node of CYK_grid[Math.max(0,word.length-1)][0]){
        
        if (node.name == start){
            inLanguage = true;
            root = node;
        }
            
        
    }

    CYK_grid.reverse();
    for (let i=0; i<CYK_grid.length; i++){
        for (let j = 0; j<CYK_grid[i].length; j++){
            // removes duplicates
            let cell = new Set();
            for (let k=0; k<CYK_grid[i][j].length; k++){

                cell.add(CYK_grid[i][j][k].name);
            }
            CYK_grid[i][j] = Array.from(cell);
        }
    }
    
    return [CYK_grid, inLanguage, root];
}

// Initiates the CYK algorithm
function populateGrid(CYK_grid, cfg, word) {
    for (let row = 0; row < CYK_grid.length; row++) {
        for (let column = 0; column < CYK_grid[row].length; column++) {
            let lst = getVars(row, column, CYK_grid, cfg, word);

            for (let variable of lst) {
                CYK_grid[row][column].push(variable);
            }
        }
    }
}

// Returns a list of variables that should go in a given cell
function getVars(row, column, CYK_grid, cfg, word) {
    let lst = [];

    if (row == 0) {
        if (word.length>0){
            return searchRules(cfg, new Node(word[column]));

        }
        else{
            return searchRules(cfg, new Node(''))
        }
    }

    for (let i = row - 1; i >= 0; i--) {
        for (let var1 of CYK_grid[i][column]) {
            for (let var2 of CYK_grid[row - i - 1][column + i + 1]) {
                let res = searchRules(cfg, var1, var2);

                for (let variable of res) {
                    lst.push(variable);
                }
            }
        }
    }

    return lst;
}

// Returns the variables that produce var1 and var2
function searchRules(cfg, var1, var2 = null) {
    
    let res = [];

    let queryString;

    if (var2 === null) {
        queryString = String(var1.name);
    } else {
        queryString = String(var1.name) + String(var2.name);
    }
    

    for (let [key, value] of cfg) {
        for (let production of value){
            if (production.join('') == queryString) {
                
                let node = new Node(key);
    
                // Terminal production
                if (var2 === null) {
                    node.children = [var1];
                } else {
                    node.children = [var1, var2];
                }
    
                res.push(node);
        }
        }
        
    }

    return res;
}