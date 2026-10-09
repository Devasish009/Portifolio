import json,struct,io,math
from pathlib import Path
import numpy as np
from PIL import Image
src=Path(r'C:/Users/SLIM3/Downloads/man_using_laptop.glb')
b=src.read_bytes();n=struct.unpack_from('<I',b,12)[0];j=json.loads(b[20:20+n]);blen=struct.unpack_from('<I',b,20+n)[0];binary=bytearray(b[28+n:28+n+blen])
def acc(i):
 a=j['accessors'][i];v=j['bufferViews'][a['bufferView']];return np.frombuffer(binary,dtype={5126:'<f4',5125:'<u4'}[a['componentType']],count=a['count']*{'VEC3':3,'VEC2':2,'SCALAR':1}[a['type']],offset=v.get('byteOffset',0)+a.get('byteOffset',0)).reshape(a['count'],-1).copy()
v=acc(0);uv=acc(1);bv=j['bufferViews'][j['images'][0]['bufferView']];tex=np.array(Image.open(io.BytesIO(binary[bv.get('byteOffset',0):bv.get('byteOffset',0)+bv['byteLength']])).convert('RGB'),dtype=np.float32)/255
# Bake bilinearly sampled albedo into dense vertex colors, then recolor geometry.
u=np.clip(uv[:,0]*tex.shape[1]-.5,0,tex.shape[1]-1);t=np.clip(uv[:,1]*tex.shape[0]-.5,0,tex.shape[0]-1);x0=u.astype(int);y0=t.astype(int);x1=np.minimum(x0+1,tex.shape[1]-1);y1=np.minimum(y0+1,tex.shape[0]-1);fu=(u-x0)[:,None];fv=(t-y0)[:,None]
c=(tex[y0,x0]*(1-fu)+tex[y0,x1]*fu)*(1-fv)+(tex[y1,x0]*(1-fu)+tex[y1,x1]*fu)*fv
new=c.copy();x,y,z=v.T
smooth=lambda a,b,q:np.clip((q-a)/(b-a),0,1)**2*(3-2*np.clip((q-a)/(b-a),0,1))
# Crown and back of the tilted head; protect the facial region and ear edges.
hair_weight=np.maximum(smooth(.69,.715,y),smooth(.60,.66,y)*(1-smooth(.25,.55,c.max(1)))*smooth(-.45,-.35,x))
face_protect=(y<.79)&(c[:,0]>.55)&(c[:,1]>.20)&(c[:,0]>c[:,1]*1.20)
hair_weight[face_protect]=0
luma=c@np.array([.2126,.7152,.0722])
# Retain sculpted highlight detail, neutralizing the baked orange cast.
shade=np.clip(.024+luma*.64,.024,.29)
hair_color=np.stack([shade*.88,shade*.94,shade],axis=1)
new=new*(1-hair_weight[:,None])+hair_color*hair_weight[:,None]
# Neutral desk and a restrained crimson front edge; exclude warm skin pixels.
skin=(c[:,0]>c[:,1]*1.24)&(c[:,1]>c[:,2]*1.17)
neutral=1-smooth(.25,.43,(c.max(1)-c.min(1))/np.maximum(c.max(1),.01))
desk=smooth(-.08,.08,x)*(1-smooth(-.047,-.02,y))*neutral*smooth(.16,.40,luma)*(~skin)
desk_color=np.stack([luma*.24,luma*.255,luma*.29],axis=1)
new=new*(1-desk[:,None])+desk_color*desk[:,None]
rim=(1-smooth(.009,.02,np.abs(y+.070)))*np.maximum(smooth(.958,.975,x),smooth(.746,.764,np.abs(z)))*desk
red=np.stack([.32+luma*.24,.028+luma*.025,.044+luma*.033],axis=1)
new=new*(1-rim[:,None])+red*rim[:,None]
# No spatial or texture changes: original topology, UVs, and roughness preserved.
linear=np.where(new<=.04045,new/12.92,((new+.055)/1.055)**2.4)
rgba=np.column_stack([np.clip(linear,0,1),np.ones(len(linear))])
color_bytes=np.rint(rgba*65535).astype('<u2').tobytes()
while len(binary)%4:binary.append(0)
offset=len(binary);binary.extend(color_bytes)
view=len(j['bufferViews']);j['bufferViews'].append({'buffer':0,'byteOffset':offset,'byteLength':len(color_bytes),'target':34962})
index=len(j['accessors']);j['accessors'].append({'bufferView':view,'componentType':5123,'normalized':True,'count':len(v),'type':'VEC4'})
j['meshes'][0]['primitives'][0]['attributes']['COLOR_0']=index
material=j['materials'][0];material['name']='Devasish natural black hair and charcoal workspace';material['pbrMetallicRoughness'].pop('baseColorTexture',None)
material['pbrMetallicRoughness']['baseColorFactor']=[1,1,1,1]
j.setdefault('extras',{})['recolorNote']='Portrait-inspired neutral black hair; charcoal desk with crimson edge. Original geometry unchanged. Original source retained separately.'
while len(binary)%4:binary.append(0)
j['buffers'][0]['byteLength']=len(binary)
js=json.dumps(j,separators=(',',':')).encode();js+=b' '*((-len(js))%4)
out=Path('output/man_using_laptop-recolored.glb');out.write_bytes(struct.pack('<III',0x46546c67,2,12+8+len(js)+8+len(binary))+struct.pack('<II',len(js),0x4e4f534a)+js+struct.pack('<II',len(binary),0x004e4942)+binary)
# Inspect both versions at identical camera angles (geometry point rendering).
comparison=Image.new('RGB',(1600,800),'#202029')
angle=-.65;cy,sy=math.cos(angle),math.sin(angle);e=.22
xx=x*cy+z*sy;zz=-x*sy+z*cy;yy=y*math.cos(e)-zz*math.sin(e);depth=y*math.sin(e)+zz*math.cos(e)
px=np.rint(xx*315+400).astype(int);py=np.rint(-yy*315+400).astype(int);order=np.argsort(depth)
for k,colors in enumerate([c,new]):
 canvas=np.full((800,800,3),[32,32,41],dtype=np.uint8);rgb=np.rint(colors[order]*255).clip(0,255).astype('uint8')
 for dx,dy in [(0,0),(-1,0),(0,-1),(1,0),(0,1)]:
  ix=px[order]+dx;iy=py[order]+dy;ok=(ix>=0)&(ix<800)&(iy>=0)&(iy<800);canvas[iy[ok],ix[ok]]=rgb[ok]
 comparison.paste(Image.fromarray(canvas),(k*800,0))
comparison.save('.artifacts/glb-review/recolor-comparison.png')
face=face_protect&(y>.47)&(x>-.35)
print('Saved:',out.resolve());print('Hair vertices changed:',int((hair_weight>.5).sum()),'Face color max delta:',float(np.max(np.abs(new[face]-c[face]))));print('Bytes:',out.stat().st_size)
