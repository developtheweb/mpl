'use strict';
/* ============ MPL M0 interpreter (ratified semantics: conformance/JUDGMENT_CALLS.md) ============ */
const BOT=Symbol('⊥'),NOMATCH=Symbol('nomatch');
/* Numbers are exact rationals (ruling 4): BigInt numerator/denominator,
   gcd-reduced, denominator > 0, constructed once at creation. */
const gcd=(a,b)=>{a=a<0n?-a:a;b=b<0n?-b:b;while(b){const t=a%b;a=b;b=t}return a};
const rat=(n,d=1n)=>{if(d<0n){n=-n;d=-d}const g=gcd(n,d)||1n;return{q:true,n:n/g,d:d/g}};
const isRat=v=>!!v&&typeof v==='object'&&v.q===true;
const R={add:(a,b)=>rat(a.n*b.d+b.n*a.d,a.d*b.d),sub:(a,b)=>rat(a.n*b.d-b.n*a.d,a.d*b.d),
 mul:(a,b)=>rat(a.n*b.n,a.d*b.d),neg:a=>rat(-a.n,a.d),
 cmp:(a,b)=>{const l=a.n*b.d,r=b.n*a.d;return l<r?-1:l>r?1:0},eq:(a,b)=>a.n===b.n&&a.d===b.d};
/* String ordering is Unicode code-point order (ruling 8). No locale, ever. */
const cmpStr=(a,b)=>{const A=[...a],B=[...b],m=Math.min(A.length,B.length);
 for(let i=0;i<m;i++){const x=A[i].codePointAt(0),y=B[i].codePointAt(0);if(x!==y)return x<y?-1:1}
 return A.length===B.length?0:A.length<B.length?-1:1};
const ESCAPES={lambda:'λ',forall:'∀',in:'∈',coloneq:'≜',leftarrow:'←',implies:'⟹',and:'∧',or:'∨',neq:'≠',leq:'≤',geq:'≥',times:'×',div:'÷',trace:'✎',bot:'⊥',parallel:'‖',circ:'∘',ast:'∗'};
function lex(src){const toks=[];let i=0,line=1,col=1;const push=(t,v,l,c)=>toks.push({t,v,line:l,col:c});const err=(key,l,c)=>{const e=new Error(key);e.key=key;e.line=l;e.col=c;throw e};
while(i<src.length){const ch=src[i],l=line,c=col;const adv=n=>{for(let k=0;k<n;k++){if(src[i]==='\n'){line++;col=1}else col++;i++}};
if(ch==='\n'||ch===' '||ch==='\t'||ch==='\r'){adv(1);continue}
if(ch==='-'&&src[i+1]==='-'){while(i<src.length&&src[i]!=='\n')adv(1);continue}
if(ch==='{'&&src[i+1]==='-'){let d=0;while(i<src.length){if(src[i]==='{'&&src[i+1]==='-'){d++;adv(2)}else if(src[i]==='-'&&src[i+1]==='}'){d--;adv(2);if(!d)break}else adv(1)}if(d)err('err_comment',l,c);continue}
if(ch==='"'){adv(1);let s='';while(i<src.length&&src[i]!=='"'){if(src[i]==='\\'){adv(1);const e=src[i];s+=e==='n'?'\n':e==='t'?'\t':e;adv(1)}else{s+=src[i];adv(1)}}if(src[i]!=='"')err('err_string',l,c);adv(1);push('str',s,l,c);continue}
if(ch==='\\'){adv(1);let w='';while(i<src.length&&/[a-zA-Z]/.test(src[i])){w+=src[i];adv(1)}const g=ESCAPES[w];if(!g)err('err_escape',l,c);push(...tokFor(g,l,c));continue}
if(/[0-9]/.test(ch)){let n='';while(i<src.length&&/[0-9]/.test(src[i])){n+=src[i];adv(1)}let f='';if(src[i]==='.'&&/[0-9]/.test(src[i+1])){adv(1);while(i<src.length&&/[0-9]/.test(src[i])){f+=src[i];adv(1)}}push('num',rat(BigInt(n+f),10n**BigInt(f.length)),l,c);continue}
if(/[a-zA-Z]/.test(ch)){let w='';while(i<src.length&&/[a-zA-Z0-9_]/.test(src[i])){w+=src[i];adv(1)}if(w==='true')push('bool',true,l,c);else if(w==='false')push('bool',false,l,c);else push('id',w,l,c);continue}
/* Type symbols lex as identifiers so ∈-constraints (λn∈ℕ:) parse; the
   parser discards the constraint unevaluated — ruling 17. 𝔹 is
   supplementary-plane (2 units). */
const glyph=String.fromCodePoint(src.codePointAt(i));
if('ℕℤℚℝℂ𝔹'.includes(glyph)){adv(glyph.length);push('id',glyph,l,c);continue}
const single='✎λ∀∈≜←⟹∧∨≠≤≥×÷∗∘‖⊥+-/=<>|;:,()[]{}';
if(single.includes(ch)){adv(1);push(...tokFor(ch,l,c));continue}
err('err_char',l,c)}
toks.push({t:'eof',v:null,line,col});return toks}
function tokFor(g,l,c){const map={'✎':'trace','λ':'lambda','∀':'forall','∈':'in','≜':'def','←':'assign','⟹':'implies','∧':'and','∨':'or','≠':'neq','≤':'leq','≥':'geq','=':'eq','<':'lt','>':'gt','+':'plus','-':'minus','×':'mul','∗':'mul','÷':'divi','/':'divi','∘':'compose','‖':'par','⊥':'bot','|':'bar',';':'semi',':':'colon',',':'comma','(':'lp',')':'rp','[':'lb',']':'rb','{':'lc','}':'rc'};return[map[g],g,l,c]}
function parse(toks){let p=0;const peek=()=>toks[p],at=t=>toks[p].t===t;
const err=(key,tok)=>{const e=new Error(key);e.key=key;e.line=tok.line;e.col=tok.col;throw e};
const eat=t=>{if(!at(t))err('err_expect',peek());return toks[p++]};
function program(){const s=seq();eat('eof');return s}
function seq(){const es=[expr()];while(at('semi')){p++;if(at('eof')||at('rc')||at('rp')||at('rb'))break;es.push(expr())}return es.length===1?es[0]:{k:'seq',es}}
function expr(){return parallel()}
function parallel(){let l=def();while(at('par')){p++;l={k:'seq',es:[l,def()]}}return l}
function def(){const l=assign();if(at('def')){const tk=toks[p++];if(l.k!=='id')err('err_def_target',tk);return{k:'def',name:l.v,e:def(),line:tk.line,col:tk.col}}return l}
function assign(){const l=cond();if(at('assign')){const tk=toks[p++];if(l.k!=='id')err('err_assign_target',tk);return{k:'set',name:l.v,e:assign(),line:tk.line,col:tk.col}}return l}
function cond(){let l=implies();while(at('bar')){p++;l={k:'alt',l,r:implies()}}return l}
function implies(){const l=lor();if(at('implies')){const tk=toks[p++];return{k:'imp',c:l,e:implies(),line:tk.line,col:tk.col}}return l}
function lor(){let l=land();while(at('or')){const tk=toks[p++];l={k:'or',l,r:land(),line:tk.line,col:tk.col}}return l}
function land(){let l=compare();while(at('and')){const tk=toks[p++];l={k:'and',l,r:compare(),line:tk.line,col:tk.col}}return l}
function compare(){const l=add();const ops={eq:1,neq:1,lt:1,gt:1,leq:1,geq:1};if(ops[peek().t]){const tk=toks[p++];return{k:'cmp',o:tk.t,l,r:add(),line:tk.line,col:tk.col}}return l}
function add(){let l=mul();while(at('plus')||at('minus')){const o=toks[p++].t;l={k:'bin',o,l,r:mul(),line:toks[p-1].line,col:toks[p-1].col}}return l}
function mul(){let l=unary();while(at('mul')||at('divi')){const o=toks[p++].t;l={k:'bin',o,l,r:unary(),line:toks[p-1].line,col:toks[p-1].col}}return l}
function unary(){if(at('trace')){const tk=toks[p++];return{k:'trace',e:unary(),line:tk.line,col:tk.col}}if(at('minus')){const tk=toks[p++];return{k:'neg',e:unary(),line:tk.line,col:tk.col}}return postfix()}
function postfix(){let e=atom();for(;;){if(at('lp')){const tk=toks[p++];const args=[];if(!at('rp')){args.push(expr());while(at('comma')){p++;args.push(expr())}}eat('rp');e={k:'call',f:e,args,line:tk.line,col:tk.col};continue}break}return e}
function pattern(){const names=[];if(at('lp')){p++;names.push(eat('id').v);while(at('comma')){p++;names.push(eat('id').v)}eat('rp')}else{names.push(eat('id').v);while(at('comma')){p++;names.push(eat('id').v)}}return names}
function atom(){const tk=peek();
if(at('num')||at('str')||at('bool')){p++;return{k:'lit',v:tk.v}}
if(at('bot')){p++;return{k:'lit',v:BOT}}
if(at('id')){p++;return{k:'id',v:tk.v,line:tk.line,col:tk.col}}
if(at('lambda')){p++;const ps=pattern();if(at('in')){p++;cond()}eat('colon');return{k:'lam',ps,body:expr()}}
if(at('forall')){p++;const v=eat('id').v;eat('in');const it=cond();eat('colon');return{k:'forall',v,it,body:expr(),line:tk.line,col:tk.col}}
if(at('lb')){p++;const es=[];if(!at('rb')){es.push(expr());while(at('comma')){p++;es.push(expr())}}eat('rb');return{k:'list',es}}
if(at('lp')){p++;const e=expr();eat('rp');return e}
if(at('lc')){p++;if(at('rc')){p++;return{k:'lit',v:BOT}}const s=seq();eat('rc');return s}
err('err_unexpected',tk)}
return program()}
function runMPL(src,print){const ast=parse(lex(src));const global={vars:new Map(),parent:null};
const lookup=(sc,n)=>{for(let s=sc;s;s=s.parent)if(s.vars.has(n))return s;return null};
const rte=(key,node)=>{const e=new Error(key);e.key=key;e.line=node.line;e.col=node.col;throw e};
const num=(v,node)=>{if(!isRat(v))rte('err_num',node);return v};
const show=v=>v===BOT?'⊥':typeof v==='string'?v:Array.isArray(v)?'['+v.map(showQ).join(', ')+']':isRat(v)?(v.d===1n?String(v.n):v.n+'/'+v.d):typeof v==='object'&&v&&v.closure?'λ':typeof v==='boolean'?(v?'true':'false'):String(v);
const showQ=v=>typeof v==='string'?'"'+v+'"':show(v);
/* Equality is structural on data; any function involved raises err_fn_eq
   (ruling 7). */
const fnIn=v=>!!v&&typeof v==='object'&&(v.closure?true:Array.isArray(v)?v.some(fnIn):false);
const dEq=(a,b)=>isRat(a)&&isRat(b)?R.eq(a,b):Array.isArray(a)&&Array.isArray(b)?a.length===b.length&&a.every((x,ix)=>dEq(x,b[ix])):a===b;
let steps=0,depth=0;const strip=v=>v===NOMATCH?BOT:v;
/* Explicit-stack machine (ruling 10): the work stack lives on the heap, so
   recursion is bounded by the λ-application depth counter — limit 10000,
   err_depth — never by the host stack. No keyless host error is reachable.
   err_steps (500000 node evaluations) is this implementation's resource
   limit (ruling 11), counted once per frame like the old per-ev-call count.
   Guard conditions and ∧ ∨ operands must be boolean — err_bool (rulings
   13, 14; ∧ ∨ short-circuit, so an unevaluated operand raises nothing).
   ≜ binds once per scope (err_redef); ← requires an existing binding
   (err_unbound) — ruling 16. */
function ev(root,sc0){
const K=[{n:root,sc:sc0,st:0}];let ret;
const push=(n,sc)=>{K.push({n,sc,st:0});if(++steps>500000){const e=new Error('err_steps');e.key='err_steps';e.line=n.line||1;e.col=n.col||1;throw e}};
const bool=(v,n)=>{if(typeof v!=='boolean')rte('err_bool',n);return v};
const apply=f=>{const fn=f.fn,n=f.n;
 if(fn.ps.length!==f.args.length)rte('err_arity',n);
 if(++depth>10000)rte('err_depth',n);
 const inner={vars:new Map(),parent:fn.sc};fn.ps.forEach((pn,ix)=>inner.vars.set(pn,f.args[ix]));
 f.st=3;push(fn.body,inner)};
while(K.length){const f=K[K.length-1],n=f.n,sc=f.sc;
switch(n.k){
case 'lit':ret=n.v;K.pop();break;
case 'id':{const s=lookup(sc,n.v);if(!s)rte('err_undef',n);ret=s.vars.get(n.v);K.pop();break}
case 'lam':ret={closure:true,ps:n.ps,body:n.body,sc};K.pop();break;
case 'seq':{if(f.st>0)f.last=strip(ret);
 if(f.st<n.es.length)push(n.es[f.st++],sc);
 else{ret=n.es.length?f.last:BOT;K.pop()}break}
case 'def':{if(f.st===0){if(sc.vars.has(n.name))rte('err_redef',n);f.st=1;push(n.e,sc)}
 else{const v=strip(ret);sc.vars.set(n.name,v);ret=v;K.pop()}break}
case 'set':{if(f.st===0){const s=lookup(sc,n.name);if(!s)rte('err_unbound',n);f.s=s;f.st=1;push(n.e,sc)}
 else{const v=strip(ret);f.s.vars.set(n.name,v);ret=v;K.pop()}break}
case 'alt':{if(f.st===0){f.st=1;push(n.l,sc)}
 else if(f.st===1){if(ret===NOMATCH){f.st=2;push(n.r,sc)}else K.pop()}
 else K.pop();break}
case 'imp':{if(f.st===0){f.st=1;push(n.c,sc)}
 else if(f.st===1){if(bool(strip(ret),n)){f.st=2;push(n.e,sc)}else{ret=NOMATCH;K.pop()}}
 else K.pop();break}
case 'or':case 'and':{const want=n.k==='or';
 if(f.st===0){f.st=1;push(n.l,sc)}
 else if(f.st===1){if(bool(strip(ret),n)===want){ret=want;K.pop()}else{f.st=2;push(n.r,sc)}}
 else{ret=bool(strip(ret),n);K.pop()}break}
case 'cmp':{if(f.st===0){f.st=1;push(n.l,sc)}
 else if(f.st===1){f.a=strip(ret);f.st=2;push(n.r,sc)}
 else{const a=f.a,b=strip(ret);
  if(n.o==='eq'||n.o==='neq'){if(fnIn(a)||fnIn(b))rte('err_fn_eq',n);const eq=dEq(a,b);ret=n.o==='eq'?eq:!eq}
  else{let d;if(isRat(a)&&isRat(b))d=R.cmp(a,b);else if(typeof a==='string'&&typeof b==='string')d=cmpStr(a,b);else rte('err_compare',n);
   ret=n.o==='lt'?d<0:n.o==='gt'?d>0:n.o==='leq'?d<=0:d>=0}
  K.pop()}break}
case 'bin':{if(f.st===0){f.st=1;push(n.l,sc)}
 else if(f.st===1){f.a=strip(ret);f.st=2;push(n.r,sc)}
 else{const a=f.a,b=strip(ret);
  if(n.o==='plus')ret=(typeof a==='string'||typeof b==='string')?show(a)+show(b):R.add(num(a,n),num(b,n));
  else if(n.o==='minus')ret=R.sub(num(a,n),num(b,n));
  else if(n.o==='mul')ret=R.mul(num(a,n),num(b,n));
  else{const bb=num(b,n);if(bb.n===0n)rte('err_div0',n);const aa=num(a,n);ret=rat(aa.n*bb.d,aa.d*bb.n)}
  K.pop()}break}
case 'neg':{if(f.st===0){f.st=1;push(n.e,sc)}else{ret=R.neg(num(strip(ret),n));K.pop()}break}
case 'trace':{if(f.st===0){f.st=1;push(n.e,sc)}else{const v=strip(ret);print(show(v));ret=v;K.pop()}break}
case 'call':{if(f.st===0){f.st=1;push(n.f,sc)}
 else if(f.st===1){const fn=strip(ret);if(!fn||!fn.closure)rte('err_notfn',n);f.fn=fn;f.args=[];
  if(n.args.length){f.st=2;push(n.args[0],sc)}else apply(f)}
 else if(f.st===2){f.args.push(strip(ret));
  if(f.args.length<n.args.length)push(n.args[f.args.length],sc);else apply(f)}
 else{depth--;ret=strip(ret);K.pop()}break}
case 'forall':{if(f.st===0){f.st=1;push(n.it,sc)}
 else if(f.st===1){const it=strip(ret);if(!Array.isArray(it))rte('err_iter',n);f.it=it;f.i=0;f.st=2;f.last=BOT;
  if(it.length)push(n.body,{vars:new Map([[n.v,it[f.i++]]]),parent:sc});else{ret=BOT;K.pop()}}
 else{f.last=strip(ret);
  if(f.i<f.it.length)push(n.body,{vars:new Map([[n.v,f.it[f.i++]]]),parent:sc});
  else{ret=f.last;K.pop()}}break}
case 'list':{if(f.st===0){f.es=[];f.st=1;if(!n.es.length){ret=[];K.pop();break}push(n.es[0],sc)}
 else{f.es.push(strip(ret));if(f.es.length<n.es.length)push(n.es[f.es.length],sc);else{ret=f.es;K.pop()}}break}
}}
return ret}
const out=strip(ev(ast,global));return show(out)}

if (typeof module !== 'undefined') module.exports = { runMPL, ESCAPES };
