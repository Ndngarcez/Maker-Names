const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
class Element{
 constructor(){this.children=[];this.events={};this.value='';}
 setAttribute(){} addEventListener(n,fn){this.events[n]=fn;} append(...x){this.children.push(...x);} replaceChildren(){this.children=[];} focus(){}
}
function setup(initial){
 const nodes={addToCart:new Element(),cartItems:new Element(),cartStatus:new Element()};let stored=initial||'[]';
 const ctx={document:{getElementById:id=>nodes[id]||null,querySelectorAll:()=>[],createElement:()=>new Element()},window:{addEventListener(){}},localStorage:{getItem:()=>stored,setItem:(k,v)=>stored=v},crypto:{randomUUID:()=>String(Math.random())},nameInput:{value:'Maria',focus(){}},placedNames:[],importedObjects:[],buildProject:()=>({text:'Maria',fontName:'Arial',letters:[{character:'M',offsetX:8}],importedObjects:[{pathData:'M0 0L2 2'}]})};
 vm.runInNewContext(fs.readFileSync('MakerNames.Api/wwwroot/v3/cart.js','utf8'),ctx);
 return {nodes,ctx,read:()=>JSON.parse(stored)};
}
test('cart preserves project, quantities, removal and reload',()=>{
 const a=setup();a.nodes.addToCart.events.click();assert.equal(a.read()[0].project.letters[0].offsetX,8);assert.equal(a.read()[0].project.importedObjects.length,1);
 let row=a.nodes.cartItems.children[0],input=row.children[2].children[0];input.value='3';input.events.change();assert.equal(a.read()[0].quantity,3);
 const b=setup(JSON.stringify(a.read()));assert.equal(b.nodes.cartItems.children.length,1);
 row=b.nodes.cartItems.children[0];input=row.children[2].children[0];input.value='0';input.events.change();assert.equal(b.read()[0].quantity,3);
 row.children[3].events.click();assert.equal(b.read().length,0);
});
test('empty design is rejected and storage failures do not report success',()=>{
 const a=setup();a.ctx.nameInput.value='';a.nodes.addToCart.events.click();assert.equal(a.read().length,0);
 a.ctx.nameInput.value='Maria';a.ctx.localStorage.setItem=()=>{throw Error('quota')};a.nodes.addToCart.events.click();assert.match(a.nodes.cartStatus.textContent,/Não foi possível/);
});
