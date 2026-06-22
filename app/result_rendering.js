'use client';
import {useState} from 'react';
import Tree from 'react-d3-tree';




export default function Results({result}){
    console.log("Result")
    console.log(result);
    let [diagram, setDiagram] = useState(0); // 0 means display CYK grid 1 means displays parse tree
    return (
        <section id="results" className="bg-slate-100 h-96">
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
        if (diagram == 1){
            if (result[1] == true){
            console.log(result[2])
            return <Tree data={result[2]} orientation='vertical' pathFunc={straightPathFunc} renderCustomNodeElement={renderCustomNode} collapsible={false}/>
  
            }
            else{
                return <Tree data={orgChart} orientation='vertical' pathFunc={straightPathFunc} renderCustomNodeElement={renderCustomNode} collapsible={false}/>

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