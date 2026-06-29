import { CYK } from "../CYK";

self.onmessage = function(e){
    console.log(e.data);
    self.postMessage(CYK(e.data[0], e.data[1], e.data[2]));
}