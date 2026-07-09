'use strict';
/* ================= MPL M0 interpreter (10 tests in js/test/) ================= */
const BOT=Symbol('⊥'),NOMATCH=Symbol('nomatch');
const ESCAPES={lambda:'λ',forall:'∀',in:'∈',coloneq:'≜',leftarrow:'←',implies:'⟹',and:'∧',or:'∨',neq:'≠',leq:'≤',geq:'≥',times:'×',div:'÷',trace:'✎',bot:'⊥',parallel:'‖',circ:'∘',ast:'∗'};
function lex(src){const toks=[];let i=0,line=1,col=1;const push=(t,v,l,c)=>toks.push({t,v,line:l,col:c});const err=(key,l,c)=>{const e=new Error(key);e.key=key;e.line=l;e.col=c;throw e};
while(i<src.length){const ch=src[i],l=line,c=col;const adv=n=>{for(let k=0;k<n;k++){if(src[i]==='\n'){line++;col=1}else col++;i++}};
if(ch==='\n'||ch===' '||ch==='\t'||ch==='\r'){adv(1);continue}
if(ch==='-'&&src[i+1]==='-'){while(i<src.length&&src[i]!=='\n')adv(1);continue}
if(ch==='{'&&src[i+1]==='-'){let d=0;while(i<src.length){if(src[i]==='{'&&src[i+1]==='-'){d++;adv(2)}else if(src[i]==='-'&&src[i+1]==='}'){d--;adv(2);if(!d)break}else adv(1)}if(d)err('err_comment',l,c);continue}
if(ch==='"'){adv(1);let s='';while(i<src.length&&src[i]!=='"'){if(src[i]==='\\'){adv(1);const e=src[i];s+=e==='n'?'\n':e==='t'?'\t':e;adv(1)}else{s+=src[i];adv(1)}}if(src[i]!=='"')err('err_string',l,c);adv(1);push('str',s,l,c);continue}
if(ch==='\\'){adv(1);let w='';while(i<src.length&&/[a-zA-Z]/.test(src[i])){w+=src[i];adv(1)}const g=ESCAPES[w];if(!g)err('err_escape',l,c);push(...tokFor(g,l,c));continue}
if(/[0-9]/.test(ch)){let n='';while(i<src.length&&/[0-9]/.test(src[i])){n+=src[i];adv(1)}if(src[i]==='.'&&/[0-9]/.test(src[i+1])){n+='.';adv(1);while(i<src.length&&/[0-9]/.test(src[i])){n+=src[i];adv(1)}}push('num',parseFloat(n),l,c);continue}
if(/[a-zA-Z]/.test(ch)){let w='';while(i<src.length&&/[a-zA-Z0-9_]/.test(src[i])){w+=src[i];adv(1)}if(w==='true')push('bool',true,l,c);else if(w==='false')push('bool',false,l,c);else push('id',w,l,c);continue}
/* Type symbols lex as identifiers so ∈-constraints (λn∈ℕ:) parse; the
   parser discards the constraint unevaluated — see §5 “Open problems”:
   parsed today, not yet enforced. 𝔹 is supplementary-plane (2 units). */
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
function implies(){const l=lor();if(at('implies')){p++;return{k:'imp',c:l,e:implies()}}return l}
function lor(){let l=land();while(at('or')){p++;l={k:'or',l,r:land()}}return l}
function land(){let l=compare();while(at('and')){p++;l={k:'and',l,r:compare()}}return l}
function compare(){const l=add();const ops={eq:1,neq:1,lt:1,gt:1,leq:1,geq:1};if(ops[peek().t]){const o=toks[p++].t;return{k:'cmp',o,l,r:add()}}return l}
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
const num=(v,node)=>{if(typeof v!=='number')rte('err_num',node);return v};
const show=v=>v===BOT?'⊥':typeof v==='string'?v:Array.isArray(v)?'['+v.map(showQ).join(', ')+']':typeof v==='object'&&v&&v.closure?'λ':typeof v==='boolean'?(v?'true':'false'):String(v);
const showQ=v=>typeof v==='string'?'"'+v+'"':show(v);
let steps=0;const strip=v=>v===NOMATCH?BOT:v;
function ev(n,sc){if(++steps>500000){const e=new Error('err_steps');e.key='err_steps';e.line=n.line||1;e.col=n.col||1;throw e}
switch(n.k){
case 'lit':return n.v;
case 'id':{const s=lookup(sc,n.v);if(!s)rte('err_undef',n);return s.vars.get(n.v)}
case 'seq':{let v=BOT;for(const e of n.es){v=ev(e,sc);if(v===NOMATCH)v=BOT}return v}
case 'def':{const v=strip(ev(n.e,sc));sc.vars.set(n.name,v);return v}
case 'set':{const v=strip(ev(n.e,sc));const s=lookup(sc,n.name)||sc;s.vars.set(n.name,v);return v}
case 'alt':{const l=ev(n.l,sc);return l===NOMATCH?ev(n.r,sc):l}
case 'imp':{const c=strip(ev(n.c,sc));return c===true||(typeof c==='number'&&c!==0)?ev(n.e,sc):NOMATCH}
case 'or':{const l=strip(ev(n.l,sc));return l===true?true:strip(ev(n.r,sc))===true}
case 'and':{const l=strip(ev(n.l,sc));return l===true?strip(ev(n.r,sc))===true:false}
case 'cmp':{const a=strip(ev(n.l,sc)),b=strip(ev(n.r,sc));const eq=JSON.stringify(a)===JSON.stringify(b);switch(n.o){case 'eq':return eq;case 'neq':return!eq;case 'lt':return a<b;case 'gt':return a>b;case 'leq':return a<=b;case 'geq':return a>=b}}
case 'bin':{const a=strip(ev(n.l,sc)),b=strip(ev(n.r,sc));switch(n.o){case 'plus':return(typeof a==='string'||typeof b==='string')?show(a)+show(b):num(a,n)+num(b,n);case 'minus':return num(a,n)-num(b,n);case 'mul':return num(a,n)*num(b,n);case 'divi':{const d=num(b,n);if(d===0)rte('err_div0',n);return num(a,n)/d}}}
case 'neg':return -num(strip(ev(n.e,sc)),n);
case 'trace':{const v=strip(ev(n.e,sc));print(show(v));return v}
case 'lam':return{closure:true,ps:n.ps,body:n.body,sc};
case 'call':{const f=strip(ev(n.f,sc));if(!f||!f.closure)rte('err_notfn',n);if(f.ps.length!==n.args.length)rte('err_arity',n);const inner={vars:new Map(),parent:f.sc};f.ps.forEach((pn,ix)=>inner.vars.set(pn,strip(ev(n.args[ix],sc))));return strip(ev(f.body,inner))}
case 'forall':{const it=strip(ev(n.it,sc));if(!Array.isArray(it))rte('err_iter',n);let v=BOT;for(const x of it){const inner={vars:new Map([[n.v,x]]),parent:sc};v=strip(ev(n.body,inner))}return v}
case 'list':return n.es.map(e=>strip(ev(e,sc)))}}
const out=strip(ev(ast,global));return show(out)}

if (typeof module !== 'undefined') module.exports = { runMPL, ESCAPES };
