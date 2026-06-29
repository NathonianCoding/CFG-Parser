import { convert_to_CNF } from "../CNF_conversion";

self.onmessage = function(e){
    console.log(e)
    self.postMessage(convert_to_CNF(e.data[0], e.data[1]));
}