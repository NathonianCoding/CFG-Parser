'use client';
import {useState} from 'react';
import { useRef } from 'react';



export default function Form(){
    let [cfg, setText] = useState("");
    let cfgTextArea = useRef(null);

    let [word, setWord] = useState("");
    let wordTextArea = useRef(null);

  

    

    //let []
   
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
                    <label className="text-sm font-semibold text-slate-700 tracking-wide uppercase">
                        CFG Rules
                    </label>
                    <p className="text-xs text-slate-400 -mt-1">Separate each rule with a semicolon</p>
                    <CfgEntryBox cfg={cfg} cfgTextArea={cfgTextArea} setText={setText}/>
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
                            onClick={(e)=>handleSubmission(e, cfg, word)}
                            className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-700 text-white text-sm font-semibold rounded-lg transition-colors duration-200 shadow-sm tracking-wide"
                        >
                            Submit
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

function CfgEntryBox({cfg, cfgTextArea, setText}){
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

function insertChar(txt, setText, textArea, char){
    let start = textArea.current.selectionStart;
    let end = textArea.current.selectionEnd;
    setText(txt.substring(0,start)+char+txt.substring(end));
   

}

function handleSubmission(e, cfg, word){
    e.preventDefault();
    console.log(cfg, word)
}

function handleConversion(e, cfg){
    e.preventDefault();
    // if !isValidCFG(cfg){}
}

function isValidCFG(cfg){
    cfg = cfg.split(" ").join("");
    let validCFG=/^[A-Z]→(([a-z]|[A-Z])+|ε)(\|(([a-z]|[A-Z])+|ε))*(,[A-Z]→(([a-z]|[A-Z])+|ε)(\|(([a-z]|[A-Z])+|ε))*)*$/.test(cfg);
    return validCFG;
}


