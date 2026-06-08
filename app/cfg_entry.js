'use client';
import {useState} from 'react';
import {useRef} from 'react';
import {formatCFG, checkInCNF} from './CNF_format_check'
import { Popover } from "@headlessui/react";




export default function Form(){
    let [cfg, setText] = useState("");
    let cfgTextArea = useRef(null);

    let [word, setWord] = useState("");
    let wordTextArea = useRef(null);

    let [validCFG, setValid] = useState(true);
    let [inCNF, setInCNF] = useState(true);
    return (

        <form id="parser" className="bg-white rounded-2xl shadow-xl shadow-slate-200 border border-slate-100 p-8 flex flex-col gap-6">
            <fieldset>

                    {/* Word input */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-700 tracking-wide uppercase">
                            Word to parse
                        </label>
                        <WordEntryBox word={word} wordTextArea={wordTextArea} setWord={setWord}/>
                    </div>

                    <div className="flex items-center gap-3 pt-1">
                        <button
                                type="button"
                                onClick={() => insertChar(word, setWord, wordTextArea,'ε')}
                                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-lg transition-colors duration-200 border border-slate-200"
                                title="Insert arrow"
                            >ε
                        </button>
                    </div>
                    

                    {/* CFG input */}
                    <div className="flex flex-col gap-2">
                        <div className="flex gap-1">
                            <label className="text-sm font-semibold text-slate-700 tracking-wide uppercase">
                                CFG Rules
                            </label>
                            <Popover>
                                <Popover.Button className="w-5 h-5 rounded-full bg-blue-100 text-slate-700 text-xs font-semibold italic flex items-center justify-center">
                                    i
                                </Popover.Button>

                                <Popover.Panel className="absolute z-10 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-sm text-gray-700">
                                    <ul className="flex flex-col gap-1 list-disc">
                                        <li>Separate each rule with a semi colon</li>
                                        <li>Terminals must be alphanumerical</li>
                                        <li>Non-terminal variables must be upper case and can optionally have a number (e.g.S0)</li>
                                        <li>Separate each transition in a rule with a vertical bar (|)</li>
                                        <li>The rule for the first variable must be first</li>
                                    </ul>
                                </Popover.Panel>
                            </Popover>
                        </div>
                    <CfgEntryBox cfg={cfg} cfgTextArea={cfgTextArea} setText={setText} validCFG={validCFG} inCNF={inCNF}/>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 pt-1">
                        <button
                            type="button"
                            onClick={() => insertChar(cfg, setText, cfgTextArea,'→')}
                            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-lg transition-colors duration-200 border border-slate-200"
                            title="Insert arrow"
                        >
                            →
                        </button>

                        <button
                            type="button"
                            onClick={() => insertChar(cfg, setText, cfgTextArea,'ε')}
                            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-lg transition-colors duration-200 border border-slate-200"
                            title="Insert arrow"
                        >ε
                        </button>

                        <button
                            type="submit"
                            onClick={(e)=>handleConversion(e, cfg)}
                            className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-700 text-white text-sm font-semibold rounded-lg transition-colors duration-200 shadow-sm tracking-wide"
                        >
                            Convert to CNF
                        </button>

                        <button
                            type="submit"
                            onClick={(e)=>handleSubmission(e, cfg, word, setValid, setInCNF)}
                            className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-700 text-white text-sm font-semibold rounded-lg transition-colors duration-200 shadow-sm tracking-wide"
                        >
                            Parse
                        </button>
                    </div>
            
              
            </fieldset>  
        </form>
    );


}

function WordEntryBox({word, wordTextArea, setWord}){
    return (
        <textarea
            ref={wordTextArea}
            onChange={(e)=>setWord(e.target.value)}
            rows={2}
            value={word}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent placeholder:text-slate-400 transition"
            placeholder="e.g. aabb"
        />

    );
}

function ErrorMessage({validCFG, inCNF}){
    if (validCFG && !inCNF){
        
        return <p className='text-xs text-red-900'>CFG not in CNF. Press 'Convert to CNF' to parse the word</p>;
    }

    if (!validCFG){
        
        return <p className='text-xs text-red-900'>Invalid CFG</p>;
    }

}

function CfgEntryBox({cfg, cfgTextArea, setText, validCFG, inCNF}){

   
    if (validCFG && inCNF){
        return (
            <textarea

                rows={5}
                ref={cfgTextArea}
                onChange={(e) => setText(e.target.value)}
                name="cfg"
                value={cfg}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 text-sm font-mono resize-y focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent placeholder:text-slate-400 transition"
                placeholder={"S → aSb | ε"}
            />
        );
     
    }
    else{
        return (
            <>
            <textarea

                rows={5}
                ref={cfgTextArea}
                onChange={(e) => setText(e.target.value)}
                name="cfg"
                value={cfg}
                className="w-full border-t-2 border-l-2 border-r-2 border-b-2 bg-slate-50 border border-red-500 rounded-lg px-4 py-3 text-slate-900 text-sm font-mono resize-y focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent placeholder:text-slate-400 transition"
                placeholder={"S → aSb | ε"}
            />
            <ErrorMessage validCFG={validCFG} inCNF={inCNF}/>
            </>
        );

    }

    
    
}


function insertChar(txt, setText, textArea, char){
    let start = textArea.current.selectionStart;
    let end = textArea.current.selectionEnd;
    setText(txt.substring(0,start)+char+txt.substring(end));
   

}

// updates validity of cfg so the UI can be updated. Once cfg is valid it executes the CYK algorithm
async function handleSubmission(e, cfg, word, setValid, setInCNF){
    e.preventDefault();
    
    let newString="";
    for(let i=0; i<cfg.length; i++){
        if (cfg.charAt(i)!=" " && cfg.charAt(i)!='\n'){
            newString+=cfg.charAt(i)
        }
    }
    cfg=newString;
    if (!isValidCFG(cfg)){
        setValid(false);

    }
    else{
        let cfgHashMap = formatCFG(cfg);
        let startVar = cfgHashMap.keys().next().value // gets start variable (first key in the hashmap)
        setValid(cfgComplete(cfgHashMap)); // changes validity of cfg after checking if it's complete
       
        setInCNF(await (checkInCNF(cfgHashMap, startVar)));
    }
}

function handleConversion(e, cfg){
    e.preventDefault();
    
}

// checks cfg syntax 
function isValidCFG(cfg){
    console.log(cfg);
    
    let validCFG=/^[A-Z][0-9]*→(([a-z0-9]|[A-Z]|[A-Z][0-9])+|ε)(\|(([a-z0-9]|[A-Z]|[A-Z][0-9]*)+|ε))*(;(\s)*[A-Z][0-9]*→(([a-z0-9]|[A-Z]|[A-Z][0-9]*)+|ε)(\|(([a-z0-9]|[A-Z]|[A-Z][0-9]*)+|ε))*)*$/.test(cfg);
    return validCFG;
}
// takes a hashmap as a parameter and outputs true if there are no non-terminals without a transition rule 
function cfgComplete(cfg){
    for (const [key, value] of cfg){
            for (const array of value){
                for (const symbol of array){
                    // if is non-terminal and doesn't have a transition rule
                    if (/[A-Z][0-9]*/.test(symbol) && !cfg.has(symbol)){
                        return false;
                        
                    }
                }
            }
        }
    return true;
}

