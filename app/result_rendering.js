'use client';
import {useState} from 'react';
import Tree from 'react-d3-tree';




export default function Results({resultsPanel, result}){
    console.log("Result")
    console.log(result);
    let [diagram, setDiagram] = useState(0); // 0 means display CYK grid 1 means displays parse tree
    return (
        <section ref = {resultsPanel} id="results" className="bg-slate-100 h-96">
            <DiagramButtons diagram = {diagram} setDiagram={setDiagram}/>
            <div className="h-90 border border-dashed border-black-300">
              <Diagram diagram = {diagram} result = {result}/>  
            </div>
        </section>
    );
}

function Diagram({diagram, result}){
    // ensures edges are straight lines and edges to leaf nodes don't go passed the edge
    let straightPathFunc = (linkDatum, orientation) => {
        const { source, target } = linkDatum;
        return orientation === 'horizontal'
        ? `M${source.y},${source.x}L${target.y-15},${target.x}`
        : `M${source.x},${source.y}L${target.x},${target.y-15}`;
    };

    // defines the radius of each node and the positioning of the label
    let renderCustomNode = ({ nodeDatum, toggleNode }) => {
        
        if (nodeDatum.name == ''){
            nodeDatum.name ='ε';
        }
       
        return (
            <g>
                <circle r={15} />
                <text x={20}>
                    {nodeDatum.name}
                </text>
            </g>
        );
    };

    if (result == null){
        if (diagram == 0){
            return <p className="text-center m-2">CYK grid will be displayed here after the form is processed</p>
        }
        else{
            return <p className='text-center m-2'>A parse tree will be displayed here if the word can be derived from the CFG</p>
        }
    }
    else{
        // render diagram
        if (diagram == 0){
            console.log("grid");
            return <CYKgrid grid={result[0]} word = {result[3]}/>
        }
        else{
            if (result[1] == true){
            console.log(result[2])
            return <Tree data={result[2]} orientation='vertical' pathFunc={straightPathFunc} renderCustomNodeElement={renderCustomNode} collapsible={false}/>
  
            }
            else{
                return <p className="text-center m-2">The word entered cannot be derived from the CFG</p>
            }
        }
        
        
    }
}

function DiagramButtons({diagram, setDiagram}){
    
    if (diagram == 0){
        return (
            <div className = "flex gap-4 ml-1">
                <button className="bg-slate-300 border rounded text-black text-sm font-semibold"
                    onClick={()=>setDiagram(0)}
                >
                    
                    CYK grid
                </button>
                <button className="bg-slate-100 border rounded text-black text-sm font-semibold"
                    onClick={()=>setDiagram(1)}
                >
                    
                    Parse Tree
                </button>
            </div>
        );

    }
    return (
        <div className = "flex gap-4 ml-1">
            <button className="bg-slate-100 border rounded text-black text-sm font-semibold"
                onClick={()=>setDiagram(0)}
            >
                
                CYK grid
            </button>
            <button className="bg-slate-300 border rounded text-black text-sm font-semibold"
                onClick={()=>setDiagram(1)}
            >
                
                Parse Tree
            </button>
        </div>
    );
    

}

function CYKgrid({grid, word}){
    if (word == ''){
        word = 'ε';
    }
    let word_as_array = word.split("");
    console.log(word_as_array) 
    
   return (

    <table className='ml-auto mr-auto mt-2'>
        <tbody>
        {grid.map((row, rowIdx) => {
            return (
                <tr key={rowIdx}>
                <th scope='col'>{grid.length-rowIdx}</th>
                {row.map((cell, colIdx) => {
                    return (
                    <td key={colIdx} className='p-2 border border-black'>
                        {cell.length === 0 ? "-" : cell.join(", ")}
                    </td>
                    );
                })}
                </tr>
            );
        })}

        <tr>
            <td></td>
            {word_as_array.map((letter, idx)=>(
                <td key = {idx} className='text-center'>
                    {letter}
                </td>
            ))}
        </tr>
        </tbody>
    </table>

  

    );

}