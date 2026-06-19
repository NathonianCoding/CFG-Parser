'use client';
import {useState} from 'react';


export default function Results({result}){
    console.log("Result")
    console.log(result);
    let [diagram, setDiagram] = useState(0); // 0 means display CYK grid 1 means displays parse tree
    return (
        <section id="results" className="bg-slate-100 h-96">
            <DiagramButtons diagram = {diagram} setDiagram={setDiagram}/>
            <div className="border border-dashed border-black-300">
              <Diagram diagram = {diagram} result = {result}/>  
            </div>
        </section>
    );
}

function Diagram({diagram, result}){
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