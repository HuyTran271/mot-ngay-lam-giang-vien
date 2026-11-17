import os
base=os.path.dirname(os.path.abspath(__file__))
out=open(os.path.join(base,'src','index.html'),encoding='utf-8').read()
import base64
_model_files={'treeOak':'tree-oak.glb','treePine':'tree-pine.glb','treeDetailed':'tree-detailed.glb','rock':'rock-large.glb','bush':'bush-large.glb','flower':'flower-red.glb'}
_parts=[]
for _k,_f in _model_files.items():
    _p=os.path.join(base,'src','assets',_f)
    if os.path.exists(_p):
        _parts.append(_k+':"data:model/gltf-binary;base64,'+base64.b64encode(open(_p,'rb').read()).decode()+'"')
out=out.replace('<!--MODELS-->', '<script>\nvar MODEL_DATA={'+','.join(_parts)+'};\n</script>')
import datetime
_now=datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=9)))
out=out.replace('<!--BUILD-->', _now.strftime('%H:%M %d/%m'))
for name in ['base','screens','dialog']:
    css=open(os.path.join(base,'src','css',name+'.css'),encoding='utf-8').read()
    tag='<link rel="stylesheet" href="css/'+name+'.css">'
    assert tag in out, 'missing css tag '+name
    out=out.replace(tag, '<style>\n'+css+'</style>')
for name in ['world/models','core/config','world/props','world/people','world/campus','world/school','world/library','world/house','world/expand','world/world','world/gratitude','story/dialogs','story/dialog-ui','story/flow','core/input','core/main']:
    js=open(os.path.join(base,'src','js',name+'.js'),encoding='utf-8').read()
    tag='<script src="js/'+name+'.js"></script>'
    assert tag in out, 'missing js tag '+name
    out=out.replace(tag, '<script>\n'+js+'</script>')
os.makedirs(os.path.join(base,'dist'), exist_ok=True)
open(os.path.join(base,'dist','index.html'),'w',encoding='utf-8').write(out)
print('built dist/index.html', len(out), 'bytes')
