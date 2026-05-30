import Form from "./cfg_entry";


export default async function HomePage() {
  test();
  
  
  
  
  return (
    <>
     
    <LandingPage/>
    <Form/>
    </>
  );
}




function LandingPage(){
 
  return (
    <div id="landingPage" className="min-h-screen bg-slate-50 flex flex-col">
      <nav className="sticky inset-0 bg-slate-900 px-8 py-4 flex items-center justify-between shadow-lg">
        <span className="text-white text-xl font-semibold tracking-tight">CFG Parser</span>
        <div className="flex gap-6">
          <a href="#landingPage" className="text-slate-300 hover:text-white text-sm font-medium transition-colors duration-200">Home</a>
          <a href="#parser" className="text-slate-300 hover:text-white text-sm font-medium transition-colors duration-200">Parser</a>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg">
        {/* Header and overview */}
        <div className='flex flex-col content-center'>
          <h1 className="text-5xl font-bold text-slate-800 tracking-tight">Welcome to CFG Parser</h1>
          <p className="text-slate-500 text-sm mt-1">Enter a word and a context-free grammar to check membership and obtain the parse tree.</p>
          <a href='#parser' className='bg-slate-900 p-4 w-32 rounded text-white text-center ml-auto mr-auto'>Get Started</a>
        </div>
      </div>
      </main>
    
    </div>
  );
}

async function test(){

    let p = new Promise(async (resolve, reject) => {
      let res = await (await fetch('api/route')).text()
      console.log(1)
      if (false){
        
        resolve('Output ' + res)
      }
      else{
        reject('failed')
      }

    })
    p.then(message=>console.log(message));
    p.catch(message=>console.log(message));
  
}
