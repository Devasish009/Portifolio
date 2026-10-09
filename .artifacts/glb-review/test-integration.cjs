const fs=require('fs'),vm=require('vm'),assert=require('assert/strict'),zlib=require('zlib');
const T=require(process.cwd()+'/dist/vendor/three.min.js');
const bytes=fs.readFileSync('dist/assets/developer-workspace.glb');const arrayBuffer=bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength);
const local=fs.readFileSync('dist/assets/developer-workspace-local.js','utf8').match(/Payload="([^"]+)"/)[1];assert(zlib.gunzipSync(Buffer.from(local,'base64')).equals(bytes));
let callbacks=new Map(),next=0,rendered,camera,intersection;
function element(){return {clientWidth:440,clientHeight:520,events:{},style:{},classList:{add(){}},append(){},remove(){},focus(){},setAttribute(){},setPointerCapture(){},addEventListener(n,f){this.events[n]=f}}}
const els=Object.fromEntries(['#developer-viewport','#scene-spin','#scene-reset','#scene-zoom-in','#scene-zoom-out'].map(id=>[id,element()]));const status=element();els['#developer-viewport'].querySelector=()=>status;
T.WebGLRenderer=class {constructor(){this.domElement=element()}setPixelRatio(){}setSize(){}dispose(){}render(s,c){rendered=s;camera=c}};
const sandbox={THREE:T,window:{THREE:T},document:{querySelector:id=>els[id],createElement:()=>({...element(),getContext:()=>({createRadialGradient:()=>({addColorStop(){}}),fillRect(){}})}),hidden:false,addEventListener(){}},devicePixelRatio:1,matchMedia:()=>({matches:false,addEventListener(){}}),ResizeObserver:class{constructor(f){this.f=f}observe(){this.f()}},IntersectionObserver:class{constructor(f){intersection=f}observe(){}},location:{protocol:'http:'},fetch:async()=>({ok:true,arrayBuffer:async()=>arrayBuffer}),performance:{now:()=>0},requestAnimationFrame:f=>{callbacks.set(++next,f);return next},cancelAnimationFrame:id=>callbacks.delete(id),TextDecoder,ArrayBuffer,Uint8Array,console};
vm.createContext(sandbox);vm.runInContext(fs.readFileSync('dist/vendor/GLTFLoader.js','utf8'),sandbox);vm.runInContext(fs.readFileSync('dist/developer-scene.js','utf8'),sandbox);
function tick(t){const pending=[...callbacks.values()];callbacks.clear();pending.forEach(f=>f(t))}
(async()=>{
assert.equal(callbacks.size,0);intersection([{isIntersecting:true}]);for(let i=0;i<100&&!status.hidden;i++)await new Promise(r=>setTimeout(r,50));assert(status.hidden,status.textContent);tick(100);assert(rendered);let meshes=0;rendered.traverse(o=>{if(o.isMesh&&o.geometry.attributes.color){meshes++;assert.equal(o.geometry.attributes.color.count,1017880);assert(o.geometry.attributes.normal);assert.equal(o.material.vertexColors,true)}});assert.equal(meshes,1);
const initial=camera.position.clone();tick(3000);tick(3040);assert(initial.distanceTo(camera.position)>0);
els['#scene-spin'].events.click();tick(3100);const paused=camera.position.clone();assert.equal(callbacks.size,0);
els['#scene-zoom-in'].events.click();tick(3200);assert(paused.distanceTo(camera.position)>.1);
const host=els['#developer-viewport'];host.events.pointerdown({button:0,pointerId:1,clientX:0,clientY:0});host.events.pointermove({pointerId:1,clientX:80,clientY:20});host.events.pointerup();tick(3300);host.events.keydown({key:'Home',preventDefault(){}});tick(3400);assert(initial.distanceTo(camera.position)<.00001);
els['#scene-spin'].events.click();intersection([{isIntersecting:false}]);assert.equal(callbacks.size,0);
console.log('PASS: actual GLB parses; colors and normals valid; lazy load, rotation, pause, zoom, drag, reset and offscreen stop. Local-file model matches exactly.');
})().catch(e=>{console.error(e);process.exitCode=1});
